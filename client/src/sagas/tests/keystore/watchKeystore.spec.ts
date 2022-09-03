import { takeLatest } from 'redux-saga/effects'
import { keystoreActions } from '../../../slices/keystore'
import watchKeystore, {
    generateKeystore,
    restoreKeystore,
    loadKeystore,
    destroyKeystore
} from '../../keystore'


describe('Test *watchKeystore saga', () => {
    const it = watchKeystore()

    test('*watchKeystore should watch for *generateKeystore saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(keystoreActions.generate.type, generateKeystore),
            done: false,
        })
    })

    test('*watchKeystore should watch for *restoreKeystore saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(keystoreActions.restore.type, restoreKeystore),
            done: false,
        })
    })

    test('*watchKeystore should watch for *loadKeystore saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(keystoreActions.load.type, loadKeystore),
            done: false,
        })
    })

    test('*watchKeystore should watch for *destroyKeystore saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(keystoreActions.destroy.type, destroyKeystore),
            done: false,
        })
    })

    test('*watchKeystore should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})