import { keystore, VaultOptions } from 'eth-lightwallet'
import { call, put, takeLatest } from 'redux-saga/effects'
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
        yield put(createWallet.fulfilled({
            keystore: serialized,
            password: payload.password
        }))
    } catch (error: any) {
        yield put(createWallet.rejected({ error }))
    }
}

function *watchGenKeystore() {
    yield takeLatest(createWallet.generate.type, genKeystore)
}

export {
    watchGenKeystore
}