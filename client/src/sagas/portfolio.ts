import { call, all, put, takeLatest } from 'redux-saga/effects'
import { portfolioActions } from '../slices/portfolio'
import {
    getBlockNumber,
    getEthBalance,
    getTransactions,
    Transaction,
    getEthPriceAt,
} from '../services'
import {
    getWeeklyData,
    getMonthlyData,
    getYearlyData,
    getErrorMessage,
    toRoundedEth,
    toRoundedFiat
} from '../utils'
import { ethers } from 'ethers'
import moment from 'moment'


export function *generateBalances ({ address, startBlock, endBlock }: { address: string, startBlock: string, endBlock: string }) {
    const transactions: Transaction[] = yield call(
        getTransactions,
        { address, startBlock, endBlock }
    )
    const balances: string[] = yield all(
        transactions.map(transaction => call(getEthBalance, address, ethers.BigNumber.from(transaction.blockNumber).toHexString()))
    )
    return balances.map((balance, index) => ({
        balance: ethers.utils.formatEther(ethers.BigNumber.from(balance)),
        timestamp: transactions[index].timestamp,
    }))
}

export function *generatePortfolioData ({ ethData, hasBalances, address }: {
    ethData: Array<{ x: string, y: string }>
    hasBalances: boolean
    address: string
}) {
    const ethPrices: string[] = yield all(
        ethData.map(({ x }) => {
            const [year, month, day] = x.split('-')
            return call(getEthPriceAt, `${day}-${month}-${year}`)
        })
    )
    if (hasBalances) {
        return {
            ethData,
            fiatData: ethData.map(({ x, y }, index) => ({
                x,
                y: toRoundedFiat(Number(ethPrices[index]) * Number(y))
            }))
        }
    } else {
        const ethBalanceWei: string = yield call(getEthBalance, address, 'latest')
        const ethBalance: string = ethers.utils.formatEther(ethers.BigNumber.from(ethBalanceWei))
        return {
            ethData: ethData.map(({ x }) => ({
                x,
                y: toRoundedEth(Number(ethBalance))
            })),
            fiatData: ethData.map(({ x }, index) => ({
                x,
                y: toRoundedFiat(Number(ethPrices[index]) * Number(ethBalance))
            }))
        }
    }
}

export function *generateWeeklyData ({ payload }: ReturnType<typeof portfolioActions.fetchWeekly>) {
    const address = payload.address
    const now = moment()
    const start = now.clone().startOf('week')
    const end = now.clone()
    try {
        const startBlock: string = yield call(getBlockNumber, start.unix())
        const endBlock: string = yield call(getBlockNumber, end.unix())
        const balances: Array<{ balance: string, timestamp: string }> = yield call(
            generateBalances,
            { address, startBlock, endBlock }
        )
        const ethData = getWeeklyData(start, end, balances, '0')
        const portfolioData: {
            ethData: Array<{ x: string, y: string }>,
            fiatData: Array<{ x: string, y: string }>,
        } = yield call(
            generatePortfolioData,
            { ethData, hasBalances: balances.length > 0, address, }
        )
        yield put(portfolioActions.fetchWeeklyFulfilled({
            address,
            data: {
                eth: portfolioData.ethData,
                fiat: portfolioData.fiatData
            }
        }))
    } catch (error: any) {
        yield put(portfolioActions.fetchRejected({
            address,
            errorMessage: getErrorMessage(error, 'Weekly data not available')})
        )
    }
}

export function *generateMonthlyData ({ payload }: ReturnType<typeof portfolioActions.fetchMonthly>) {
    const address = payload.address
    const now = moment()
    const start = now.clone().startOf('month')
    const end = now.clone()
    try {
        const startBlock: string = yield call(getBlockNumber, start.unix())
        const endBlock: string = yield call(getBlockNumber, end.unix())
        const balances: Array<{ balance: string, timestamp: string }> = yield call(
            generateBalances,
            { address, startBlock, endBlock }
        )
        const ethData = getMonthlyData(start, end, balances, '0')
        const portfolioData: {
            ethData: Array<{ x: string, y: string }>,
            fiatData: Array<{ x: string, y: string }>,
        } = yield call(
            generatePortfolioData,
            { ethData, hasBalances: balances.length > 0, address, }
        )
        yield put(portfolioActions.fetchMonthlyFulfilled({
            address,
            data: {
                eth: portfolioData.ethData,
                fiat: portfolioData.fiatData
            }
        }))
    } catch (error: any) {
        yield put(portfolioActions.fetchRejected({
            address,
            errorMessage: getErrorMessage(error, 'Monthly data not available')})
        )
    }
}

export function *generateYearlyData ({ payload }: ReturnType<typeof portfolioActions.fetchYearly>) {
    const address = payload.address
    const now = moment()
    const start = now.clone().subtract(1, 'year')
    const end = now.clone()
    try {
        const startBlock: string = yield call(getBlockNumber, start.unix())
        const endBlock: string = yield call(getBlockNumber, end.unix())
        const balances: Array<{ balance: string, timestamp: string }> = yield call(
            generateBalances,
            { address, startBlock, endBlock }
        )
        const ethData = getYearlyData(start, end, balances, '0')
        const portfolioData: {
            ethData: Array<{ x: string, y: string }>,
            fiatData: Array<{ x: string, y: string }>,
        } = yield call(
            generatePortfolioData,
            { ethData, hasBalances: balances.length > 0, address, }
        )
        yield put(portfolioActions.fetchYearlyFulfilled({
            address,
            data: {
                eth: portfolioData.ethData,
                fiat: portfolioData.fiatData
            }
        }))
    } catch (error: any) {
        yield put(portfolioActions.fetchRejected({
            address,
            errorMessage: getErrorMessage(error, 'Yearly data not available')})
        )
    }
}

export default function *watchPortfolio () {
    yield takeLatest(portfolioActions.fetchWeekly.type, generateWeeklyData)
    yield takeLatest(portfolioActions.fetchMonthly.type, generateMonthlyData)
    yield takeLatest(portfolioActions.fetchYearly.type, generateYearlyData)
}