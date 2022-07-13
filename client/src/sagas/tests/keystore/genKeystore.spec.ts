import { put, call } from 'redux-saga/effects'
import { STATUS_CODES } from '../../keystore'
import { keystoreActions } from '../../../slices/keystore'
import { generateKeystore } from '../../keystore'
import { createVault } from '../../../utils'

const mockAction = keystoreActions.generate({
    password: '',
    seedPhrase: '',
    hdPathString: '',
})

describe('Test *genKeystore fulfilled case', () => {
    const it = generateKeystore(mockAction)

    test('*genKeystore should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.pending()),
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
            value: put(keystoreActions.fulfilled({
                keystore: keystore.serialize(),
                statusCode: STATUS_CODES.GENERATE_KEYSTORE,
                successMessage: 'Wallet created'
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
    const it = generateKeystore(mockAction)

    test('*genKeystore should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.pending()),
            done: false,
        })
    })

    test('*genKeystore should dispatch rejected action', () => {
        const error = {
            message: 'random message',
            errorCode: 1,
        }
        it.next()
        expect(it.throw(error)).toEqual({
            value: put(keystoreActions.rejected({ errorMessage: error.message, statusCode: error.errorCode })),
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