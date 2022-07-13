import { keystore } from 'eth-lightwallet'
import { call, put, delay, select, takeLatest } from 'redux-saga/effects'
import { keystoreActions } from '../slices/keystore'
import { getSerializedKeystore } from '../selectors/keystore'
import {
    setCurrentKeystoreHash,
    getCurrentSerializedKeystore,
    addKeystore as localStorageAddKeystore,
    restoreKeystore as localStorageRestoreKeystore,
    addAddress as localStorageAddAddress,
    editAddress as localStorageEditAddress,
    deleteAddress as localStorageDeleteAddress,
} from '../localStorage'
import {
    createVault,
    keyFromPassword,
    serializeKeystore,
    deserializeKeystore,
    getKsHash,
} from '../utils'

const ERROR_MESSAGES = {
    INITIALIZE: 'Something went wrong while initializing the wallet',
    ALREADY_INITIALIZED: 'Can\'t restore wallet, there is already one initialized',
    WALLET_EXISTS_NOT: 'Can\'t restore wallet, it does not exist',
    RESTORE: 'Something went wrong while restoring the wallet',
    GENERATE_ADDRESS: 'Something went wrong while generating address',
}

export const STATUS_CODES = {
    GENERATE_KEYSTORE: 1,
    RESTORE_KEYSTORE: 2,
    LOAD_KEYSTORE: 3,
    DESTROY_KEYSTORE: 4,
    GENERATE_ADDRESS: 5,
    EDIT_ADDRESS: 6,
    DELETE_ADDRESS: 7,
}

function *genKeystore({ payload }: ReturnType<typeof keystoreActions.generate>) {
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
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.INITIALIZE
        yield put(keystoreActions.rejected({
            errorMessage,
            statusCode: STATUS_CODES.GENERATE_KEYSTORE
        }))
    }
}

function *restoreKeystore({ payload }: ReturnType<typeof keystoreActions.restore>) {
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
            errorMessage: ERROR_MESSAGES.WALLET_EXISTS_NOT,
            statusCode: STATUS_CODES.RESTORE_KEYSTORE
        }))
    }
}

function *loadKeystore ({ payload }: ReturnType<typeof keystoreActions.load>) {
    yield put(keystoreActions.pending())
    const ks = payload.keystore
    if (!ks) {
        yield put(keystoreActions.rejected({
            errorMessage: ERROR_MESSAGES.INITIALIZE,
            statusCode: STATUS_CODES.LOAD_KEYSTORE
        }))
        return
    }
    yield put(keystoreActions.fulfilled({
        keystore: ks,
        statusCode: STATUS_CODES.LOAD_KEYSTORE,
        successMessage: 'Wallet successfully loaded'
    }))
}

function *destroyKeystore () {
    yield put(keystoreActions.pending())
    yield delay(300)
    setCurrentKeystoreHash(null)
    yield put(keystoreActions.fulfilled({
        keystore: null,
        statusCode: STATUS_CODES.DESTROY_KEYSTORE,
        successMessage: 'Wallet successfully closed'
    }))
}

function *generateAddress ({ payload }: ReturnType<typeof keystoreActions.generateAddress>) {
    yield put(keystoreActions.pending())
    const reduxSerialized: string | null = yield select(getSerializedKeystore)
    const localStorageSerialized = getCurrentSerializedKeystore()
    if (!reduxSerialized || !localStorageSerialized || reduxSerialized !== localStorageSerialized) {
        yield put(keystoreActions.rejected({
            statusCode: STATUS_CODES.GENERATE_ADDRESS,
            errorMessage: 'Can\'t add address, wallet not initialized',
        }))
        return
    }
    const ks: keystore = deserializeKeystore(reduxSerialized)
    try {
        const pwDerivedKey: Uint8Array = yield call(keyFromPassword, ks, payload.password)
        const { ksSerialized } = localStorageAddAddress(pwDerivedKey)
        yield put(keystoreActions.fulfilled({
            keystore: ksSerialized,
            statusCode: STATUS_CODES.GENERATE_ADDRESS,
            successMessage: 'Account added successfully'
        }))
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.GENERATE_ADDRESS
        yield put(keystoreActions.rejected({ errorMessage, statusCode: STATUS_CODES.GENERATE_ADDRESS }))
    }
}

function *editAddress ({ payload }: ReturnType<typeof keystoreActions.editAddress>) {
    yield put(keystoreActions.pending())
    yield delay(300)
    const reduxSerialized: string | null = yield select(getSerializedKeystore)
    const localStorageSerialized = getCurrentSerializedKeystore()
    if (!reduxSerialized || !localStorageSerialized || reduxSerialized !== localStorageSerialized) {
        yield put(keystoreActions.rejected({
            statusCode: STATUS_CODES.GENERATE_ADDRESS,
            errorMessage: 'Can\'t edit address, wallet not initialized',
        }))
        return
    }
    try {
        localStorageEditAddress(payload.address, payload.alias)
        yield put(keystoreActions.resolved({
            statusCode: STATUS_CODES.EDIT_ADDRESS,
            error: false,
            message: 'Address successfully edited'
        }))
    } catch (error: any) {
        yield put(keystoreActions.rejected({
            errorMessage: 'Can\'t edit address, wallet is not initialized',
            statusCode: STATUS_CODES.EDIT_ADDRESS
        }))
    }
}

function *deleteAddress ({ payload }: ReturnType<typeof keystoreActions.deleteAddress>) {
    yield put(keystoreActions.pending())
    yield delay(300)
    const reduxSerialized: string | null = yield select(getSerializedKeystore)
    const localStorageSerialized = getCurrentSerializedKeystore()
    if (!reduxSerialized || !localStorageSerialized || reduxSerialized !== localStorageSerialized) {
        yield put(keystoreActions.rejected({
            statusCode: STATUS_CODES.GENERATE_ADDRESS,
            errorMessage: 'Can\'t delete address, wallet not initialized',
        }))
        return
    }
    try {
        localStorageDeleteAddress(payload.address)
        yield put(keystoreActions.resolved({
            statusCode: STATUS_CODES.DELETE_ADDRESS,
            error: false,
            message: 'Address successfully deleted'
        }))
    } catch (error: any) {
        yield put(keystoreActions.rejected({
            errorMessage: 'Can\'t delete address, it does not exist',
            statusCode: STATUS_CODES.DELETE_ADDRESS
        }))
    }
}

function *watchGenKeystore() {
    yield takeLatest(keystoreActions.generate.type, genKeystore)
    yield takeLatest(keystoreActions.restore.type, restoreKeystore)
    yield takeLatest(keystoreActions.load.type, loadKeystore)
    yield takeLatest(keystoreActions.destroy.type, destroyKeystore)
    yield takeLatest(keystoreActions.generateAddress.type, generateAddress)
    yield takeLatest(keystoreActions.editAddress.type, editAddress)
    yield takeLatest(keystoreActions.deleteAddress.type, deleteAddress)
}

export {
    genKeystore,
    restoreKeystore,
    loadKeystore,
    watchGenKeystore
}