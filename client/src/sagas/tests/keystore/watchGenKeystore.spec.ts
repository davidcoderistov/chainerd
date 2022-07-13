import { takeLatest } from 'redux-saga/effects'
import { keystoreActions } from '../../../slices/keystore'
import watchKeystore, { generateKeystore } from '../../keystore'

describe('Test *watchGenKeystore', () => {
    const it = watchKeystore()

    test('*watchGenKeystore should yield takeLatest effect', () => {
        expect(it.next()).toEqual({
            value: takeLatest(keystoreActions.generate.type, generateKeystore),
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