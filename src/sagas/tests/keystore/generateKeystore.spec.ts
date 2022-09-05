import { put, call } from 'redux-saga/effects'
import { STATUS_CODES, generateKeystore } from '../../keystore'
import { keystoreActions } from '../../../slices/keystore'
import { addressActions } from '../../../slices/address'
import { createVault, serializeKeystore } from '../../../utils'


describe('Test *generateKeystore saga', () => {
    const payload = {
        password: 'random password',
        seedPhrase: 'random seed phrase',
        hdPathString: 'm/44\'/60\'/0\'/0',
    }
    // @ts-ignore
    const it = generateKeystore(keystoreActions.generate(payload))

    test('*generateKeystore should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.pending()),
            done: false,
        })
    })

    test('*generateKeystore should call createVault fn', () => {
        expect(it.next()).toEqual({
            value: call(createVault, payload),
            done: false,
        })
    })

    const keystore: any = {
        serialize: () => 'random string'
    }

    test('*generateKeystore should dispatch keystore fulfilled action', () => {
        expect(it.next(keystore)).toEqual({
            value: put(keystoreActions.fulfilled({
                keystore: serializeKeystore(keystore),
                statusCode: STATUS_CODES.GENERATE_KEYSTORE,
                successMessage: 'Wallet successfully created'
            })),
            done: false,
        })
    })

    test('*generateKeystore should dispatch address fulfilled action', () => {
        expect(it.next()).toEqual({
            value: put(addressActions.loadAll({ keystore: serializeKeystore(keystore) })),
            done: false,
        })
    })

    test('*generateKeystore should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})