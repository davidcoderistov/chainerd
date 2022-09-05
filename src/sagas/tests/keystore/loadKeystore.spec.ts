import { put, delay } from 'redux-saga/effects'
import { STATUS_CODES, loadKeystore } from '../../keystore'
import { keystoreActions } from '../../../slices/keystore'
import { addressActions } from '../../../slices/address'


describe('Test *loadKeystore rejected case', () => {
    const it = loadKeystore(keystoreActions.load({ keystore: '' }))

    test('*loadKeystore should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.pending()),
            done: false,
        })
    })

    test('*loadKeystore should be delayed by 300ms', () => {
        expect(it.next()).toEqual({
            value: delay(300),
            done: false,
        })
    })

    test('*loadKeystore should dispatch rejected action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.rejected({
                statusCode: STATUS_CODES.LOAD_KEYSTORE,
                errorMessage: 'Something went wrong while initializing the wallet',
            })),
            done: false,
        })
    })

    test('*loadKeystore should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})

describe('Test *loadKeystore fulfilled case', () => {
    const keystore = 'random keystore'
    const it = loadKeystore(keystoreActions.load({ keystore }))

    test('*loadKeystore should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.pending()),
            done: false,
        })
    })

    test('*loadKeystore should be delayed by 300ms', () => {
        expect(it.next()).toEqual({
            value: delay(300),
            done: false,
        })
    })

    test('*loadKeystore should dispatch keystore fulfilled action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.fulfilled({
                keystore,
                statusCode: STATUS_CODES.LOAD_KEYSTORE,
                successMessage: 'Wallet successfully loaded',
            })),
            done: false,
        })
    })

    test('*loadKeystore should dispatch address fulfilled action', () => {
        expect(it.next()).toEqual({
            value: put(addressActions.loadAll({ keystore })),
            done: false,
        })
    })

    test('*loadKeystore should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})