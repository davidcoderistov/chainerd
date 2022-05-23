import { takeLatest } from 'redux-saga/effects'
import { createWallet } from '../../../slices/keystore'
import { genKeystore, watchGenKeystore } from '../../keystore'

describe('Test *watchGenKeystore', () => {
    const it = watchGenKeystore()

    test('*watchGenKeystore should yield takeLatest effect', () => {
        expect(it.next()).toEqual({
            value: takeLatest(createWallet.generate.type, genKeystore),
            done: false,
        })
    })

    test('*watchGenKeystore should end', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})