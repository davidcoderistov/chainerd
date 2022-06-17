import { keystore, VaultOptions } from 'eth-lightwallet'
import { call, put, takeLatest } from 'redux-saga/effects'
import store from 'store'
import { keystoreActions } from '../slices/keystore'

const ERROR_MESSAGES = {
    INITIALIZE: 'Something went wrong while initializing the wallet',
    ALREADY_INITIALIZED: 'Can\'t restore wallet, there is already one initialized',
    WALLET_EXISTS_NOT: 'Can\'t restore wallet, it does not exist',
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

function addLocalKeystore (serialized: string) {
    // Add current keystore
    store.set(STORE_KEYS.KEYSTORE, serialized)

    // Add all keystores if first time
    if (!store.get(STORE_KEYS.ALL_KEYSTORES)) {
        store.set(STORE_KEYS.ALL_KEYSTORES, {})
    }

    // Add keystore to saved keystores
    const allKeystores = store.get(STORE_KEYS.ALL_KEYSTORES)
    if (allKeystores && !allKeystores.hasOwnProperty(serialized)) {
        store.set(STORE_KEYS.ALL_KEYSTORES, {
            ...allKeystores,
            [serialized]: [],
        })
    }
}

function keystoreExists (serialized: string) {
    const allKeystores = store.get(STORE_KEYS.ALL_KEYSTORES)
    return !!(allKeystores && allKeystores.hasOwnProperty(serialized))

}


function *genKeystore({ payload }: ReturnType<typeof keystoreActions.generate>) {
    yield put(keystoreActions.pending())
    try {
        const ks: keystore = yield call(createVault, payload)
        const serialized = ks.serialize()
        addLocalKeystore(serialized)
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
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.ALREADY_INITIALIZED, errorCode: 2 } }))
        return
    }
    const ks: keystore = yield call(createVault, payload)
    if (keystoreExists(ks.serialize())) {
        yield put(keystoreActions.generate(payload))
    } else {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.WALLET_EXISTS_NOT, errorCode: 3 }}))
    }
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