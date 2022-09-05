import { put, call, select, all } from 'redux-saga/effects'
import { fetchLatestTransactions } from '../../portfolio'
import { portfolioActions } from '../../../slices/portfolio'
import { getTransactions, Transaction, getEthPriceAt } from '../../../services'
import { getNetwork } from '../../../selectors/network'
import { toRoundedEth, toRoundedFiat } from '../../../utils'
import { ethers } from 'ethers'
import moment from 'moment'


describe('Test *fetchLatestTransactions saga', () => {
    const payload = {
        addresses: [
            '0x4281eCF07378Ee595C564a59048801330f3084eE',
            '0xcDC8E4EEF1441e8f1a4759C567bfB53EfA51944F',
        ]
    }
    const it = fetchLatestTransactions(portfolioActions.fetchLatestTransactions(payload))

    let transactions: Transaction[]

    beforeAll(() => {
        transactions = [
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
    })

    test('*fetchLatestTransactions no addresses case', () => {
        const it = fetchLatestTransactions(portfolioActions.fetchLatestTransactions({ addresses: [] }))

        expect(it.next()).toEqual({
            value: put(portfolioActions.fetchLatestTransactionsFulfilled({ transactions: [] })),
            done: false,
        })

        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*fetchLatestTransactions should select network', () => {
        expect(it.next()).toEqual({
            value: select(getNetwork),
            done: false,
        })
    })

    test('*fetchLatestTransactions should call all effect on transactions', () => {
        const network = 'mainnet'
        // @ts-ignore
        expect(it.next(network)).toEqual({
            value: all(
                payload.addresses.map(address => call(getTransactions, {
                    address,
                    page: 1,
                    offset: 5,
                    sort: 'desc',
                }, network))
            ),
            done: false,
        })
    })

    test('*fetchLatestTransactions should call all effect on gas prices', () => {
        // @ts-ignore
        expect(it.next(transactions)).toEqual({
            value: all(
                transactions.map(({ timestamp }) => {
                    return call(getEthPriceAt, moment.unix(Number(timestamp)).format('DD-MM-YYYY'))
                })),
            done: false,
        })
    })

    test('*fetchLatestTransactions should dispatch fulfilled action', () => {
        const ethPrices = ['2200', '2500']

        // @ts-ignore
        expect(it.next(ethPrices)).toEqual({
            value: put(portfolioActions.fetchLatestTransactionsFulfilled({
                transactions: transactions.map((transaction, index) => {
                    const ethAmount = toRoundedEth(Number(ethers.utils.formatEther(ethers.BigNumber.from(transaction.value))))
                    return {
                        from: transaction.from,
                        to: transaction.to,
                        hash: transaction.hash,
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
            })),
            done: false,
        })
    })

    test('*fetchLatestTransactions should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})