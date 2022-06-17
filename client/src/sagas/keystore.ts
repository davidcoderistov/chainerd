import { keystore, VaultOptions } from 'eth-lightwallet'
import { call, put, takeLatest } from 'redux-saga/effects'
import store from 'store'
import { createWallet } from '../slices/keystore'

const ERROR_MESSAGES = {
    INITIALIZE: 'Something went wrong while initializing the wallet',
    RESTORE: 'Can\'t restore wallet, already initialized',
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
    const allKeystores = store.get('allKeystores')
    if (allKeystores && allKeystores.hasOwnProperty(keystore) && Array.isArray(allKeystores[keystore])) {
        return allKeystores[keystore]
    }
    return []
}


function *genKeystore({ payload }: ReturnType<typeof createWallet.generate>) {
    yield put(createWallet.pending())
    try {
        const ks: keystore = yield call(createVault, payload)
        const serialized = ks.serialize()
        store.set('keystore', serialized)
        yield put(createWallet.fulfilled({
            keystore: serialized,
            addresses: getAddresses(serialized),
        }))
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.INITIALIZE
        yield put(createWallet.rejected({ error: { message: errorMessage, errorCode: 1 } }))
    }
}

function *restoreKeystore({ payload }: ReturnType<typeof createWallet.restore>) {
    const serialized = store.get('keystore')
    if (serialized) {
        yield put(createWallet.rejected({ error: { message: ERROR_MESSAGES.RESTORE, errorCode: 2 } }))
        return
    }
    yield put(createWallet.generate(payload))
}

function *loadKeystore ({ payload }: ReturnType<typeof createWallet.load>) {
    const serialized = store.get('keystore')
    if (serialized !== payload.keystore) {
        yield put(createWallet.rejected({ error: { message: ERROR_MESSAGES.INITIALIZE, errorCode: 1 } }))
        return
    }
    yield put(createWallet.fulfilled({
        keystore: serialized,
        addresses: getAddresses(serialized),
    }))
}

function *destroyKeystore () {
    store.set('keystore', null)
    yield put(createWallet.fulfilled({
        keystore: null,
        addresses: [],
    }))
}

function *watchGenKeystore() {
    yield takeLatest(createWallet.generate.type, genKeystore)
    yield takeLatest(createWallet.restore.type, restoreKeystore)
    yield takeLatest(createWallet.load.type, loadKeystore)
    yield takeLatest(createWallet.destroy.type, destroyKeystore)
}

export {
    createVault,
    genKeystore,
    restoreKeystore,
    loadKeystore,
    watchGenKeystore
}