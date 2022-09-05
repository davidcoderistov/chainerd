import { put, call } from 'redux-saga/effects'
import { setGasInfo, STATUS_CODES } from '../../transaction'
import { transactionActions } from '../../../slices/transaction'
import { getGasInfo } from '../../../services'
import { roundedWeiToGwei } from '../../../utils'


describe('Test *setGasInfo saga', () => {
    const it = setGasInfo()

    test('*setGasInfo should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(transactionActions.pending()),
            done: false,
        })
    })

    test('*setGasInfo should call getGasInfo', () => {
        expect(it.next()).toEqual({
            value: call(getGasInfo),
            done: false,
        })
    })

    test('*setGasInfo should dispatch fulfilled action', () => {
        const gasInfo = {
            lowGasPrice: 200,
            mediumGasPrice: 300,
            highGasPrice: 400,
        }
        expect(it.next(gasInfo)).toEqual({
            value: put(transactionActions.setGasInfoFulfilled({
                lowGasPrice: gasInfo.lowGasPrice,
                gasPrice: roundedWeiToGwei(gasInfo.mediumGasPrice),
                highGasPrice: gasInfo.highGasPrice,
                statusCode: STATUS_CODES.SET_GAS_INFO,
                successMessage: 'Gas info successfully fetched'
            })),
            done: false,
        })
    })

    test('*setGasInfo should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})