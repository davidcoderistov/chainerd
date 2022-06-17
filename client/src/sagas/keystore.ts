import { keystore, VaultOptions } from 'eth-lightwallet'
import { call, put, takeLatest } from 'redux-saga/effects'
import store from 'store'
import { keystoreActions } from '../slices/keystore'

const ERROR_MESSAGES = {
    INITIALIZE: 'Something went wrong while initializing the wallet',
    ALREADY_INITIALIZED: 'Can\'t restore wallet, there is already one initialized',
    WALLET_EXISTS_NOT: 'Can\'t restore wallet, it does not exist',
    RESTORE: 'Something went wrong while restoring the wallet',
}

export const STORE_KEYS = {
    KEYSTORE: 'keystore',
    PREV_KEYSTORE: 'prevKeystore',
    ADDRESSES: 'addresses',
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

function keyFromPassword(ks: keystore, password: string) {
    return new Promise((resolve, reject) => {
        ks.keyFromPassword(password, (error, pwDerivedKey) => {
            if (error) {
                return reject(error)
            }
            return resolve(pwDerivedKey)
        })
    })
}

function *genKeystore({ payload }: ReturnType<typeof keystoreActions.generate>) {
    yield put(keystoreActions.pending())
    try {
        const ks: keystore = yield call(createVault, payload)
        const serialized = ks.serialize()
        const addresses = Array.isArray(payload.addresses) ? payload.addresses : []
        store.set(STORE_KEYS.KEYSTORE, serialized)
        store.set(STORE_KEYS.PREV_KEYSTORE, serialized)
        store.set(STORE_KEYS.ADDRESSES, addresses)
        yield put(keystoreActions.fulfilled({
            keystore: serialized,
            addresses,
        }))
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.INITIALIZE
        yield put(keystoreActions.rejected({ error: { message: errorMessage, errorCode: 1 } }))
    }
}

function *restoreKeystore({ payload }: ReturnType<typeof keystoreActions.restore>) {
    yield put(keystoreActions.pending())
    const serialized = store.get(STORE_KEYS.KEYSTORE)
    if (serialized) {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.ALREADY_INITIALIZED, errorCode: 2 } }))
        return
    }
    try {
        const prevKeystore = store.get(STORE_KEYS.PREV_KEYSTORE)
        if (!prevKeystore) {
            yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.WALLET_EXISTS_NOT, errorCode: 3 }}))
            return
        }
        const ks: keystore = keystore.deserialize(prevKeystore)
        const pwDerivedKey: Uint8Array = yield call(keyFromPassword, ks, payload.password)
        if (ks.getSeed(pwDerivedKey) === payload.seedPhrase) {
            yield put(keystoreActions.generate({
                ...payload,
                addresses: store.get(STORE_KEYS.ADDRESSES)
            }))
        } else {
            yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.WALLET_EXISTS_NOT, errorCode: 3 }}))
        }
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.RESTORE
        yield put(keystoreActions.rejected({ error: { message: errorMessage, errorCode: 4 } }))
    }
}

function *loadKeystore ({ payload }: ReturnType<typeof keystoreActions.load>) {
    const serialized = store.get(STORE_KEYS.KEYSTORE)
    if (serialized !== payload.keystore) {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.INITIALIZE, errorCode: 1 } }))
        return
    }
    const addresses = store.get(STORE_KEYS.ADDRESSES)
    yield put(keystoreActions.fulfilled({
        keystore: serialized,
        addresses,
    }))
}

function *destroyKeystore () {
    store.set(STORE_KEYS.KEYSTORE, null)
    yield put(keystoreActions.fulfilled({
        keystore: null,
        addresses: [],
    }))
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