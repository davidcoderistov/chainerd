import { keystore, VaultOptions } from 'eth-lightwallet'
import { call, put, delay, takeLatest } from 'redux-saga/effects'
import { plainToInstance, instanceToPlain } from 'class-transformer'
import keccak256 from 'keccak256'
import { keystoreActions } from '../slices/keystore'
import {
    keystoreHashExists,
    setKeystoreHash,
    addKeystore,
    setKeystore,
    setAddressAlias,
    deleteAddress as deleteStoreAddress,
    getKeystoreByHash,
    getCurrentKeystore,
    getKeystoreHash,
    getCurrentAddresses
} from '../localStorage'

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

function createVault(opts: VaultOptions): Promise<keystore> {
    return new Promise((resolve, reject) => {
        keystore.createVault(opts, (error, ks) => {
            if (error) {
                return reject(error)
            }
            return resolve(ks)
        })
    })
}

function keyFromPassword(ks: keystore, password: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        ks.keyFromPassword(password, (error, pwDerivedKey) => {
            if (error) {
                return reject(error)
            }
            return resolve(pwDerivedKey)
        })
    })
}

function serializeKeystore (ks: keystore): string {
    return JSON.stringify(instanceToPlain(ks))
}

function deserializeKeystore(ks: string): keystore {
    return plainToInstance(keystore, JSON.parse(ks))
}

function getKsHash (password: string, seed: string) {
    return keccak256(`${password} ${seed}`).toString('hex')
}

function *genKeystore({ payload }: ReturnType<typeof keystoreActions.generate>) {
    yield put(keystoreActions.pending())
    try {
        const ks: keystore = yield call(createVault, payload)
        const serialized = serializeKeystore(ks)
        const ksHash = getKsHash(payload.password, payload.seedPhrase)
        setKeystoreHash(ksHash)
        addKeystore(ksHash, {
            keystore: serialized,
            addresses: [],
            addressAliases: {},
        })
        yield put(keystoreActions.fulfilled({ keystore: serialized, statusCode: STATUS_CODES.GENERATE_KEYSTORE, successMessage: 'Wallet successfully created' }))
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.INITIALIZE
        yield put(keystoreActions.rejected({ errorMessage, statusCode: STATUS_CODES.GENERATE_KEYSTORE }))
    }
}

function *restoreKeystore({ payload }: ReturnType<typeof keystoreActions.restore>) {
    yield put(keystoreActions.pending())
    yield delay(300)
    if (keystoreHashExists()) {
        yield put(keystoreActions.rejected({ errorMessage: ERROR_MESSAGES.ALREADY_INITIALIZED, statusCode: STATUS_CODES.RESTORE_KEYSTORE }))
        return
    }
    const ksHash = getKsHash(payload.password, payload.seedPhrase)
    const ks = getKeystoreByHash(ksHash)
    if (ks) {
        setKeystoreHash(ksHash)
        yield put(keystoreActions.fulfilled({ keystore: ks, statusCode: STATUS_CODES.RESTORE_KEYSTORE, successMessage: 'Wallet successfully restored' }))
    } else {
        yield put(keystoreActions.rejected({ errorMessage: ERROR_MESSAGES.WALLET_EXISTS_NOT, statusCode: STATUS_CODES.RESTORE_KEYSTORE }))
    }
}

function *loadKeystore ({ payload }: ReturnType<typeof keystoreActions.load>) {
    yield put(keystoreActions.pending())
    const ks = payload.keystore
    if (!ks) {
        yield put(keystoreActions.rejected({ errorMessage: ERROR_MESSAGES.INITIALIZE, statusCode: STATUS_CODES.LOAD_KEYSTORE }))
        return
    }
    yield put(keystoreActions.fulfilled({ keystore: ks, statusCode: STATUS_CODES.LOAD_KEYSTORE, successMessage: 'Wallet successfully loaded' }))
}

function *destroyKeystore () {
    yield put(keystoreActions.pending())
    yield delay(300)
    setKeystoreHash(null)
    yield put(keystoreActions.fulfilled({ keystore: null, statusCode: STATUS_CODES.DESTROY_KEYSTORE, successMessage: 'Wallet successfully closed' }))
}

function *generateAddress ({ payload }: ReturnType<typeof keystoreActions.generateAddress>) {
    yield put(keystoreActions.pending())
    const serialized = getCurrentKeystore()
    if (!serialized) {
        yield put(keystoreActions.rejected({ errorMessage: ERROR_MESSAGES.WALLET_EXISTS_NOT, statusCode: STATUS_CODES.GENERATE_ADDRESS }))
        return
    }
    const ks: keystore = deserializeKeystore(serialized)
    try {
        const pwDerivedKey: Uint8Array = yield call(keyFromPassword, ks, payload.password)
        ks.generateNewAddress(pwDerivedKey, 1)
        const serialized = serializeKeystore(ks)
        const ksHash = getKeystoreHash()
        if (!ksHash) {
            yield put(keystoreActions.rejected({ errorMessage: ERROR_MESSAGES.WALLET_EXISTS_NOT, statusCode: STATUS_CODES.GENERATE_ADDRESS }))
            return
        }
        if (setKeystore(ksHash, serialized, ks.getAddresses()[ks.getAddresses().length - 1])) {
            yield put(keystoreActions.fulfilled({ keystore: serialized, statusCode: STATUS_CODES.GENERATE_ADDRESS, successMessage: 'Account added successfully' }))
        } else {
            yield put(keystoreActions.rejected({ errorMessage: ERROR_MESSAGES.WALLET_EXISTS_NOT, statusCode: STATUS_CODES.GENERATE_ADDRESS }))
        }
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.GENERATE_ADDRESS
        yield put(keystoreActions.rejected({ errorMessage, statusCode: STATUS_CODES.GENERATE_ADDRESS }))
    }
}

function *editAddress ({ payload }: ReturnType<typeof keystoreActions.editAddress>) {
    yield put(keystoreActions.pending())
    yield delay(300)
    const hash = getKeystoreHash()
    if (!hash) {
        yield put(keystoreActions.rejected({
            errorMessage: 'Can\'t edit address, wallet is not initialized',
            statusCode: STATUS_CODES.EDIT_ADDRESS
        }))
        return
    }
    const addresses = getCurrentAddresses()
    if (!payload.address || !Array.isArray(addresses) || addresses.findIndex(address => address === payload.address) < 0) {
        yield put(keystoreActions.rejected({
            errorMessage: 'Can\'t edit address, it does not exist',
            statusCode: STATUS_CODES.EDIT_ADDRESS
        }))
        return
    }
    const success = setAddressAlias(hash, payload.address, payload.alias)
    yield put(keystoreActions.resolved({
        statusCode: STATUS_CODES.EDIT_ADDRESS,
        error: !success,
        message: success ? 'Address successfully edited' : 'Something went wrong while trying to edit the address'
    }))
}

function *deleteAddress ({ payload }: ReturnType<typeof keystoreActions.deleteAddress>) {
    yield put(keystoreActions.pending())
    yield delay(300)
    const hash = getKeystoreHash()
    if (!hash) {
        yield put(keystoreActions.rejected({
            errorMessage: 'Can\'t delete address, wallet is not initialized',
            statusCode: STATUS_CODES.DELETE_ADDRESS
        }))
        return
    }
    const addresses = getCurrentAddresses()
    if (!payload.address || !Array.isArray(addresses) || addresses.findIndex(address => address === payload.address) < 0) {
        yield put(keystoreActions.rejected({
            errorMessage: 'Can\'t delete address, it does not exist',
            statusCode: STATUS_CODES.DELETE_ADDRESS
        }))
        return
    }
    const success = deleteStoreAddress(hash, payload.address)
    yield put(keystoreActions.resolved({
        statusCode: STATUS_CODES.DELETE_ADDRESS,
        error: !success,
        message: success ? 'Address successfully deleted' : 'Something went wrong while trying to delete the address'
    }))
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
    createVault,
    keyFromPassword,
    serializeKeystore,
    deserializeKeystore,
    genKeystore,
    restoreKeystore,
    loadKeystore,
    watchGenKeystore
}