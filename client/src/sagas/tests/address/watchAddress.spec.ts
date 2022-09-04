import { takeLatest } from 'redux-saga/effects'
import { addressActions } from '../../../slices/address'
import watchAddress, {
    loadAll,
    generateAddress,
    editAddress,
    deleteAddress,
    syncEthPrice,
} from '../../address'


describe('Test *watchAddress saga', () => {
    const it = watchAddress()

    test('*watchAddress should watch for *loadAll saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(addressActions.loadAll.type, loadAll),
            done: false,
        })
    })

    test('*watchAddress should watch for *generateAddress saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(addressActions.generate.type, generateAddress),
            done: false,
        })
    })

    test('*watchAddress should watch for *editAddress saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(addressActions.edit.type, editAddress),
            done: false,
        })
    })

    test('*watchAddress should watch for *deleteAddress saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(addressActions.delete.type, deleteAddress),
            done: false,
        })
    })

    test('*watchAddress should watch for *syncEthPrice saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(addressActions.syncEthPrice.type, syncEthPrice),
            done: false,
        })
    })

    test('*watchAddress should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})