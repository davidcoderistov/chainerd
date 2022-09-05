import { put, call, select, all } from 'redux-saga/effects'
import { generateYearlyData, generateBalances, generatePortfolioData } from '../../portfolio'
import { portfolioActions } from '../../../slices/portfolio'
import { accountActions } from '../../../slices/account'
import { getBlockNumber, getEthPriceAt } from '../../../services'
import { getNetwork } from '../../../selectors/network'
import { getYearlyData, toRoundedEth, toRoundedFiat } from '../../../utils'
import moment from 'moment'
import _orderBy from "lodash/orderBy";
import {ethers} from "ethers";


describe('Test *generateYearlyData saga', () => {
    const startBlock = 'startBlock'
    const endBlock = 'endBlock'
    const network = 'mainnet'
    const balances = [
        {
            balance: '300000000000000000',
            timestamp: '1657019657000',
        },
        {
            balance: '743000000000000000',
            timestamp: '1649157257000',
        },
    ]

    const transactions = [
        {
            blockHash: 'random blockHash',
            blockNumber: 'random blockNumber',
            cumulativeGasUsed: 'random cumulativeGasUsed',
            from: 'random from',
            gas: 'random gas',
            gasPrice: '300000000000000',
            gasUsed: '21000',
            hash: 'random hash',
            nonce: 'random nonce',
            timestamp: '1657019657000',
            to: 'random to',
            value: '300000000000000000',
            status: 'random status',
        },
        {
            blockHash: 'random blockHash 2',
            blockNumber: 'random blockNumber 2',
            cumulativeGasUsed: 'random cumulativeGasUsed 2',
            from: 'random from 2',
            gas: 'random gas 2',
            gasPrice: '300000000000000',
            gasUsed: '21000',
            hash: 'random hash 2',
            nonce: 'random nonce 2',
            timestamp: '1649157257000',
            to: 'random to 2',
            value: '700000000000000000',
            status: 'random status 2',
        },
    ]

    const payload = { address: '0x4281eCF07378Ee595C564a59048801330f3084eE' }
    const it = generateYearlyData(portfolioActions.fetchYearly(payload))

    let start: moment.Moment, end: moment.Moment

    beforeAll(() => {
        const now = moment()
        start = now.clone().subtract(1, 'year')
        end = now.clone()
    })

    test('*generateYearlyData should select network', () => {
        expect(it.next()).toEqual({
            value: select(getNetwork),
            done: false,
        })
    })

    test('*generateYearlyData should call get start block', () => {
        // @ts-ignore
        expect(it.next(network)).toEqual({
            value: call(getBlockNumber, start.unix(), network),
            done: false,
        })
    })

    test('*generateYearlyData should call get end block', () => {
        // @ts-ignore
        expect(it.next(startBlock)).toEqual({
            value: call(getBlockNumber, end.unix(), network),
            done: false,
        })
    })

    test('*generateYearlyData should call *generateBalances saga', () => {
        // @ts-ignore
        expect(it.next(endBlock)).toEqual({
            value: call(
                generateBalances,
                { address: payload.address, startBlock, endBlock }
            ),
            done: false,
        })
    })

    test('*generateYearlyData should call get eth prices', () => {
        const ethData = getYearlyData(start, end, balances, '0')

        // @ts-ignore
        expect(it.next({ balances, transactions })).toEqual({
            value: all(
                ethData.map(({ x }) => {
                    const [year, month, day] = x.split('-')
                    return call(getEthPriceAt, `${day}-${month}-${year}`)
                })
            ),
            done: false,
        })
    })

    test('*generateYearlyData should update accounts', () => {
        const ethPrices = ['2200', '3200', '1500']

        // @ts-ignore
        expect(it.next(ethPrices)).toEqual({
            value: put(accountActions.fetchTransactionsFulfilled({
                address: payload.address,
                data: _orderBy(transactions.map((transaction, index) => {
                    const ethAmount = toRoundedEth(Number(ethers.utils.formatEther(ethers.BigNumber.from(transaction.value))))
                    return {
                        hash: transaction.hash,
                        from: transaction.from,
                        to: transaction.to,
                        timestamp: transaction.timestamp,
                        value: toRoundedFiat(Number(ethPrices[index]) * Number(ethAmount)),
                        amount: ethAmount,
                        blockNumber: transaction.blockNumber,
                        status: transaction.status,
                        fee: toRoundedEth(
                            Number(ethers.utils.formatEther(ethers.BigNumber.from(transaction.gasUsed).mul(ethers.BigNumber.from(transaction.gasPrice))))
                        )
                    }
                }), 'timestamp', 'desc'),
            })),
            done: false,
        })
    })

    test('*generateYearlyData should call *generatePortfolio saga', () => {
        const ethData = getYearlyData(start, end, balances, '0')
        const ethPrices = ['2200', '3200', '1500']

        expect(it.next()).toEqual({
            value: call(
                generatePortfolioData,
                { ethData, ethPrices, hasBalances: balances.length > 0, address: payload.address, }
            ),
            done: false,
        })
    })

    test('*generateYearlyData should dispatch fulfilled action', () => {
        const ethData = getYearlyData(start, end, balances, '0')
        const ethPrices = ['2200', '3200', '1500']
        const portfolioData = {
            ethData: ethData.map(({ x, y }) => ({
                x,
                y: toRoundedEth(Number(y))
            })),
            fiatData: ethData.map(({ x, y }, index) => ({
                x,
                y: toRoundedFiat(Number(ethPrices[index]) * Number(y))
            }))
        }
        // @ts-ignore
        expect(it.next(portfolioData)).toEqual({
            value: put(portfolioActions.fetchYearlyFulfilled({
                address: payload.address,
                data: {
                    eth: portfolioData.ethData,
                    fiat: portfolioData.fiatData
                }
            })),
            done: false,
        })
    })

    test('*generateYearlyData should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

})