import { keystore } from 'eth-lightwallet'
import { call, put, delay, takeLatest } from 'redux-saga/effects'
import { keystoreActions } from '../slices/keystore'
import {
    setCurrentKeystoreHash,
    addKeystore as localStorageAddKeystore,
    restoreKeystore as localStorageRestoreKeystore,
} from '../localStorage'
import {
    createVault,
    serializeKeystore,
    getKsHash,
    getErrorMessage,
} from '../utils'

export const STATUS_CODES = {
    GENERATE_KEYSTORE: 1,
    RESTORE_KEYSTORE: 2,
    LOAD_KEYSTORE: 3,
    DESTROY_KEYSTORE: 4,
}

export function *generateKeystore ({ payload }: ReturnType<typeof keystoreActions.generate>) {
    yield put(keystoreActions.pending())
    try {
        const ks: keystore = yield call(createVault, payload)
        const ksHash = getKsHash(payload.password, payload.seedPhrase)
        const serialized = serializeKeystore(ks)
        localStorageAddKeystore(ksHash, serialized)
        yield put(keystoreActions.fulfilled({
            keystore: serialized,
            statusCode: STATUS_CODES.GENERATE_KEYSTORE,
            successMessage: 'Wallet successfully created'
        }))
    } catch (error: any) {
        yield put(keystoreActions.rejected({
            statusCode: STATUS_CODES.GENERATE_KEYSTORE,
            errorMessage: getErrorMessage(error, 'Something went wrong while initializing the wallet')
        }))
    }
}

export function *restoreKeystore ({ payload }: ReturnType<typeof keystoreActions.restore>) {
    yield put(keystoreActions.pending())
    yield delay(300)
    const ksHash = getKsHash(payload.password, payload.seedPhrase)
    try {
        const serialized = localStorageRestoreKeystore(ksHash)
        yield put(keystoreActions.fulfilled({
            keystore: serialized,
            statusCode: STATUS_CODES.RESTORE_KEYSTORE,
            successMessage: 'Wallet successfully restored'
        }))
    } catch (error: any) {
        yield put(keystoreActions.rejected({
            statusCode: STATUS_CODES.RESTORE_KEYSTORE,
            errorMessage: getErrorMessage(error, 'Something went wrong while restoring the wallet'),
        }))
    }
}

export function *loadKeystore ({ payload }: ReturnType<typeof keystoreActions.load>) {
    yield put(keystoreActions.pending())
    const ks = payload.keystore
    if (!ks) {
        yield put(keystoreActions.rejected({
            statusCode: STATUS_CODES.LOAD_KEYSTORE,
            errorMessage: 'Something went wrong while initializing the wallet',
        }))
        return
    }
    yield put(keystoreActions.fulfilled({
        keystore: ks,
        statusCode: STATUS_CODES.LOAD_KEYSTORE,
        successMessage: 'Wallet successfully loaded'
    }))
}

export function *destroyKeystore () {
    yield put(keystoreActions.pending())
    yield delay(300)
    setCurrentKeystoreHash(null)
    yield put(keystoreActions.fulfilled({
        keystore: null,
        statusCode: STATUS_CODES.DESTROY_KEYSTORE,
        successMessage: 'Wallet successfully closed'
    }))
}

export default function *watchKeystore () {
    yield takeLatest(keystoreActions.generate.type, generateKeystore)
    yield takeLatest(keystoreActions.restore.type, restoreKeystore)
    yield takeLatest(keystoreActions.load.type, loadKeystore)
    yield takeLatest(keystoreActions.destroy.type, destroyKeystore)
}