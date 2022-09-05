import { debounce, takeLatest } from 'redux-saga/effects'
import watchTransaction, {
    setEthAmount,
    setFiatAmount,
    setGasInfo,
    sendTransaction,
} from '../../transaction'
import { transactionActions } from '../../../slices/transaction'


describe('Test *watchTransaction saga', () => {
    const it = watchTransaction()

    test('*watchTransaction should debounce *setEthAmount saga', () => {
        expect(it.next()).toEqual({
            value: debounce(500, transactionActions.setEthAmount.type, setEthAmount),
            done: false,
        })
    })

    test('*watchTransaction should debounce *setFiatAmount saga', () => {
        expect(it.next()).toEqual({
            value: debounce(500, transactionActions.setFiatAmount.type, setFiatAmount),
            done: false,
        })
    })

    test('*watchTransaction should watch for *setGasInfo saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(transactionActions.setGasInfo.type, setGasInfo),
            done: false,
        })
    })

    test('*watchTransaction should watch for *sendTransaction saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(transactionActions.sendTransaction.type, sendTransaction),
            done: false,
        })
    })

    test('*watchTransaction should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})