import { put, call } from 'redux-saga/effects'
import { createWallet } from '../../../slices/keystore'
import { genKeystore, createVault } from '../../keystore'

const mockAction = createWallet.generate({
    password: '',
    seedPhrase: '',
    hdPathString: '',
})

describe('Test *genKeystore fulfilled case', () => {
    const it = genKeystore(mockAction)

    test('*genKeystore should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(createWallet.pending()),
            done: false,
        })
    })

    test('*genKeystore should call createVault fn', () => {
        expect(it.next()).toEqual({
            value: call(createVault, mockAction.payload),
            done: false,
        })
    })

    test('*genKeystore should dispatch fulfilled action', () => {
        const keystore: any = {
            serialize: () => 'random string'
        }
        expect(it.next(keystore)).toEqual({
            value: put(createWallet.fulfilled({
                keystore: keystore.serialize(),
                password: mockAction.payload.password,
            })),
            done: false,
        })
    })

    test('*genKeystore should end', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})

describe('Test *genKeystore rejected case', () => {
    const it = genKeystore(mockAction)

    test('*genKeystore should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(createWallet.pending()),
            done: false,
        })
    })

    test('*genKeystore should dispatch rejected action', () => {
        const error = {}
        it.next()
        expect(it.throw(error)).toEqual({
            value: put(createWallet.rejected({ error })),
            done: false,
        })
    })

    test('*genKeystore should end', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})