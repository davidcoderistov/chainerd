import { call, all, put, takeLatest } from 'redux-saga/effects'
import { accountActions } from '../slices/account'
import {
    getTransactions,
    getEthPriceAt,
    getTransactionCount,
    Transaction,
} from '../services'
import { toRoundedEth, toRoundedFiat } from '../utils'
import moment from 'moment'
import { ethers } from 'ethers'


export function *fetchTransactions ({ payload }: ReturnType<typeof accountActions.fetchTransactions>) {
    const { address, page } = payload
    try {
        let count = -1
        const transactions: Transaction[] = yield call(
            getTransactions,
            { address, page, offset: 5, sort: 'desc' }
        )
        const ethPrices: string[] = yield all(
            transactions.map(({ timestamp }) => {
                return call(getEthPriceAt, moment.unix(Number(timestamp)).format('DD-MM-YYYY'))
            })
        )
        if (page <= 1) {
            count = yield call(getTransactionCount, address)
        }
        yield put(accountActions.fetchTransactionsFulfilled({
            address,
            page,
            data: transactions.map((transaction, index) => {
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
            }),
            ...count >= 0 && { count }
        }))
    } catch (error: any) {
        yield put(accountActions.fetchTransactionsFulfilled({
            address,
            page,
            data: []
        }))
    }
}

export default function *watchAccount () {
    yield takeLatest(accountActions.fetchTransactions.type, fetchTransactions)
}