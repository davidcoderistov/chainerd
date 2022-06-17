import { keystore, VaultOptions } from 'eth-lightwallet'
import { call, put, takeLatest } from 'redux-saga/effects'
import store from 'store'
import { keystoreActions } from '../slices/keystore'

const ERROR_MESSAGES = {
    INITIALIZE: 'Something went wrong while initializing the wallet',
    RESTORE: 'Can\'t restore wallet, already initialized',
}

export const STORE_KEYS = {
    KEYSTORE: 'keystore',
    ALL_KEYSTORES: 'allKeystores',
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

function getAddresses (keystore: string) {
    const allKeystores = store.get(STORE_KEYS.ALL_KEYSTORES)
    if (allKeystores && allKeystores.hasOwnProperty(keystore) && Array.isArray(allKeystores[keystore])) {
        return allKeystores[keystore]
    }
    return []
}


function *genKeystore({ payload }: ReturnType<typeof keystoreActions.generate>) {
    yield put(keystoreActions.pending())
    try {
        const ks: keystore = yield call(createVault, payload)
        const serialized = ks.serialize()
        store.set(STORE_KEYS.KEYSTORE, serialized)
        yield put(keystoreActions.fulfilled({
            keystore: serialized,
            addresses: getAddresses(serialized),
        }))
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.INITIALIZE
        yield put(keystoreActions.rejected({ error: { message: errorMessage, errorCode: 1 } }))
    }
}

function *restoreKeystore({ payload }: ReturnType<typeof keystoreActions.restore>) {
    const serialized = store.get(STORE_KEYS.KEYSTORE)
    if (serialized) {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.RESTORE, errorCode: 2 } }))
        return
    }
    yield put(keystoreActions.generate(payload))
}

function *loadKeystore ({ payload }: ReturnType<typeof keystoreActions.load>) {
    const serialized = store.get(STORE_KEYS.KEYSTORE)
    if (serialized !== payload.keystore) {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.INITIALIZE, errorCode: 1 } }))
        return
    }
    yield put(keystoreActions.fulfilled({
        keystore: serialized,
        addresses: getAddresses(serialized),
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