import { put, call } from 'redux-saga/effects'
import { transactionActions } from '../../../slices/transaction'
import { setAmount, STATUS_CODES } from '../../transaction'
import { getEthPrice } from '../../../services'


describe('Test *setAmount saga', () => {
    const it = setAmount((() => '100'))

    test('*setAmount should call getEthPrice', () => {
        expect(it.next()).toEqual({
            value: call(getEthPrice),
            done: false,
        })
    })

    test('*setAmount should dispatch fulfilled action', () => {
        expect(it.next(100)).toEqual({
            value: put(transactionActions.setAmountFulfilled({
                statusCode: STATUS_CODES.GET_ETH_PRICE,
                successMessage: 'Eth price successfully fetched',
                ethAmount: '100',
                fiatAmount: '100',
                ethPrice: 100,
            })),
            done: false,
        })
    })

    test('*setAmount should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})