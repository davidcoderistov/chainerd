import { keystore, VaultOptions } from 'eth-lightwallet'
import { call, put, takeLatest } from 'redux-saga/effects'
import store from 'store'
import { createWallet } from '../slices/keystore'


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


function *genKeystore({ payload }: ReturnType<typeof createWallet.generate>) {
    yield put(createWallet.pending())
    try {
        const ks: keystore = yield call(createVault, payload)
        const serialized = ks.serialize()
        store.set('keystore', serialized)
        yield put(createWallet.fulfilled({
            keystore: serialized,
            password: payload.password
        }))
    } catch (error: any) {
        yield put(createWallet.rejected({ error }))
    }
}

function *restoreKeystore({ payload }: ReturnType<typeof createWallet.restore>) {
    const serialized = store.get('keystore')
    if (serialized) {
        yield put(createWallet.rejected({ error: 'Can\'t restore wallet, already initialized' }))
        return
    }
    yield put(createWallet.generate(payload))
}

function *watchGenKeystore() {
    yield takeLatest(createWallet.generate.type, genKeystore)
    yield takeLatest(createWallet.restore.type, restoreKeystore)
}

export {
    createVault,
    genKeystore,
    watchGenKeystore
}