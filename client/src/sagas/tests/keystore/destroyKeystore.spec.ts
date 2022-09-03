import { put, delay } from 'redux-saga/effects'
import { STATUS_CODES, destroyKeystore } from '../../keystore'
import { keystoreActions } from '../../../slices/keystore'
import { addressActions } from '../../../slices/address'


describe('Test *destroyKeystore fulfilled case', () => {
    const it = destroyKeystore()

    test('*destroyKeystore should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.pending()),
            done: false,
        })
    })

    test('*destroyKeystore should be delayed by 300ms', () => {
        expect(it.next()).toEqual({
            value: delay(300),
            done: false,
        })
    })

    test('*destroyKeystore should dispatch keystore fulfilled action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.fulfilled({
                keystore: null,
                statusCode: STATUS_CODES.DESTROY_KEYSTORE,
                successMessage: 'Wallet successfully closed',
            })),
            done: false,
        })
    })

    test('*destroyKeystore should dispatch address fulfilled action', () => {
        expect(it.next()).toEqual({
            value: put(addressActions.loadAllFulfilled({
                addresses: [],
            })),
            done: false,
        })
    })

    test('*destroyKeystore should reach end of execution', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})