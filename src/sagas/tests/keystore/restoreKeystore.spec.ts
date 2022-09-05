import { put, delay } from 'redux-saga/effects'
import { STATUS_CODES, restoreKeystore } from '../../keystore'
import { keystoreActions } from '../../../slices/keystore'
import { addressActions } from '../../../slices/address'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import { getKsHash } from '../../../utils'
import store from 'store'


describe('Test *restoreKeystore saga', () => {
    const payload = {
        password: 'random password',
        seedPhrase: 'random seed phrase',
        hdPathString: 'm/44\'/60\'/0\'/0',
    }
    const it = cloneableGenerator(restoreKeystore)(keystoreActions.restore(payload))

    test('*restoreKeystore should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(keystoreActions.pending()),
            done: false,
        })
    })

    test('*restoreKeystore should be delayed by 300ms', () => {
        expect(it.next()).toEqual({
            value: delay(300),
            done: false,
        })
    })

    test('*restoreKeystore should dispatch already initialized rejected case', () => {
        const clone = it.clone()
        store.set('hash', 'random hash')
        expect(clone.next()).toEqual({
            value: put(keystoreActions.rejected({
                statusCode: STATUS_CODES.RESTORE_KEYSTORE,
                errorMessage: 'Can\'t restore wallet, already initialized'
            })),
            done: false,
        })
    })

    test('*restoreKeystore should dispatch wallet does not exist rejected case', () => {
        const clone = it.clone()
        store.clearAll()
        expect(clone.next()).toEqual({
            value: put(keystoreActions.rejected({
                statusCode: STATUS_CODES.RESTORE_KEYSTORE,
                errorMessage: 'Can\'t restore wallet, it does not exist'
            })),
            done: false,
        })
    })

    test('*restoreKeystore should dispatch fulfilled case', () => {
        const clone = it.clone()
        const ksHash = getKsHash(payload.password, payload.seedPhrase)
        const keystore = 'random keystore'
        store.set('all', {
            [ksHash]: {
                keystore,
            }
        })
        expect(clone.next()).toEqual({
            value: put(keystoreActions.fulfilled({
                keystore,
                statusCode: STATUS_CODES.RESTORE_KEYSTORE,
                successMessage: 'Wallet successfully restored',
            })),
            done: false,
        })
        expect(clone.next()).toEqual({
            value: put(addressActions.loadAll({
                keystore,
            })),
            done: false,
        })
    })
})