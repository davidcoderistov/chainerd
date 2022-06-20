import { keystore, VaultOptions } from 'eth-lightwallet'
import { call, put, takeLatest } from 'redux-saga/effects'
import keccak256 from 'keccak256'
import store from 'store'
import { keystoreActions } from '../slices/keystore'

const ERROR_MESSAGES = {
    INITIALIZE: 'Something went wrong while initializing the wallet',
    ALREADY_INITIALIZED: 'Can\'t restore wallet, there is already one initialized',
    WALLET_EXISTS_NOT: 'Can\'t restore wallet, it does not exist',
    RESTORE: 'Something went wrong while restoring the wallet',
}

export const BROWSER_STORAGE_KEYS = {
    KEYSTORE: 'keystore',
    ALL: 'all',
}

function createVault(opts: VaultOptions) {
    return new Promise((resolve, reject) => {
        keystore.createVault(opts, (error, ks) => {
            if (error) {
                return reject(error)
            }
            return resolve(ks)
        })
    })
}

function getKsHash (password: string, seed: string) {
    return keccak256(`${password} ${seed}`).toString('hex')
}

function *genKeystore({ payload }: ReturnType<typeof keystoreActions.generate>) {
    yield put(keystoreActions.pending())
    try {
        const ks: keystore = yield call(createVault, payload)
        store.set(BROWSER_STORAGE_KEYS.KEYSTORE, ks)
        if (!store.get(BROWSER_STORAGE_KEYS.ALL)) {
            store.set(BROWSER_STORAGE_KEYS.ALL, {})
        }
        const ksHash = getKsHash(payload.password, payload.seedPhrase)
        const all = store.get(BROWSER_STORAGE_KEYS.ALL)
        store.set(BROWSER_STORAGE_KEYS.ALL, {
            ...all,
            [ksHash]: ks,
        })
        yield put(keystoreActions.fulfilled({ keystore: ks }))
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.INITIALIZE
        yield put(keystoreActions.rejected({ error: { message: errorMessage, errorCode: 1 } }))
    }
}

function *restoreKeystore({ payload }: ReturnType<typeof keystoreActions.restore>) {
    yield put(keystoreActions.pending())
    if (store.get(BROWSER_STORAGE_KEYS.KEYSTORE)) {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.ALREADY_INITIALIZED, errorCode: 2 } }))
        return
    }
    const ksHash = getKsHash(payload.password, payload.seedPhrase)
    const all = store.get(BROWSER_STORAGE_KEYS.ALL)
    if (all && all.hasOwnProperty(ksHash)) {
        const ks = all[ksHash]
        store.set(BROWSER_STORAGE_KEYS.KEYSTORE, ks)
        yield put(keystoreActions.fulfilled({ keystore: ks }))
    } else {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.WALLET_EXISTS_NOT, errorCode: 3 }}))
    }
}

function *loadKeystore ({ payload }: ReturnType<typeof keystoreActions.load>) {
    const ks = payload.keystore
    if (!ks) {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.INITIALIZE, errorCode: 1 } }))
        return
    }
    yield put(keystoreActions.fulfilled({ keystore: ks }))
}

function *destroyKeystore () {
    store.set(BROWSER_STORAGE_KEYS.KEYSTORE, null)
    yield put(keystoreActions.fulfilled({ keystore: null }))
}

function *watchGenKeystore() {
    yield takeLatest(keystoreActions.generate.type, genKeystore)
    yield takeLatest(keystoreActions.restore.type, restoreKeystore)
    yield takeLatest(keystoreActions.load.type, loadKeystore)
    yield takeLatest(keystoreActions.destroy.type, destroyKeystore)
}

export {
    createVault,
    genKeystore,
    restoreKeystore,
    loadKeystore,
    watchGenKeystore
}