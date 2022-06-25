import { keystore, VaultOptions } from 'eth-lightwallet'
import { call, put, takeLatest } from 'redux-saga/effects'
import { plainToInstance, instanceToPlain } from 'class-transformer'
import keccak256 from 'keccak256'
import { keystoreActions } from '../slices/keystore'
import {
    keystoreHashExists,
    setKeystoreHash,
    addKeystore,
    setKeystore,
    getKeystoreByHash,
    getCurrentKeystore,
    getKeystoreHash
} from '../localStorage'

const ERROR_MESSAGES = {
    INITIALIZE: 'Something went wrong while initializing the wallet',
    ALREADY_INITIALIZED: 'Can\'t restore wallet, there is already one initialized',
    WALLET_EXISTS_NOT: 'Can\'t restore wallet, it does not exist',
    RESTORE: 'Something went wrong while restoring the wallet',
    GENERATE_ADDRESS: 'Something went wrong while generating address',
}

export const SUCCESS_CODES = {
    GENERATE_KEYSTORE: 1,
    RESTORE_KEYSTORE: 2,
    LOAD_KEYSTORE: 3,
    DESTROY_KEYSTORE: 4,
    GENERATE_ADDRESS: 5,
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
        yield put(keystoreActions.fulfilled({ keystore: serialized, successCode: SUCCESS_CODES.GENERATE_KEYSTORE }))
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.INITIALIZE
        yield put(keystoreActions.rejected({ error: { message: errorMessage, errorCode: 1 } }))
    }
}

function *restoreKeystore({ payload }: ReturnType<typeof keystoreActions.restore>) {
    yield put(keystoreActions.pending())
    if (keystoreHashExists()) {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.ALREADY_INITIALIZED, errorCode: 2 } }))
        return
    }
    const ksHash = getKsHash(payload.password, payload.seedPhrase)
    const ks = getKeystoreByHash(ksHash)
    if (ks) {
        setKeystoreHash(ksHash)
        yield put(keystoreActions.fulfilled({ keystore: ks, successCode: SUCCESS_CODES.RESTORE_KEYSTORE }))
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
    yield put(keystoreActions.fulfilled({ keystore: ks, successCode: SUCCESS_CODES.LOAD_KEYSTORE }))
}

function *destroyKeystore () {
    setKeystoreHash(null)
    yield put(keystoreActions.fulfilled({ keystore: null, successCode: SUCCESS_CODES.DESTROY_KEYSTORE }))
}

function *generateAddress ({ payload }: ReturnType<typeof keystoreActions.generateAddress>) {
    yield put(keystoreActions.pending())
    const serialized = getCurrentKeystore()
    if (!serialized) {
        yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.WALLET_EXISTS_NOT, errorCode: 3 }}))
        return
    }
    const ks: keystore = deserializeKeystore(serialized)
    try {
        const pwDerivedKey: Uint8Array = yield call(keyFromPassword, ks, payload.password)
        ks.generateNewAddress(pwDerivedKey, 1)
        const serialized = serializeKeystore(ks)
        const ksHash = getKeystoreHash()
        if (!ksHash) {
            yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.WALLET_EXISTS_NOT, errorCode: 3 }}))
            return
        }
        if (setKeystore(ksHash, serialized, ks.getAddresses())) {
            yield put(keystoreActions.fulfilled({ keystore: serialized, successCode: SUCCESS_CODES.GENERATE_ADDRESS }))
        } else {
            yield put(keystoreActions.rejected({ error: { message: ERROR_MESSAGES.WALLET_EXISTS_NOT, errorCode: 3 }}))
        }
    } catch (error: any) {
        const errorMessage = (error && error.message) ? error.message : ERROR_MESSAGES.GENERATE_ADDRESS
        yield put(keystoreActions.rejected({ error: { message: errorMessage, errorCode: 5 } }))
    }
}

function *watchGenKeystore() {
    yield takeLatest(keystoreActions.generate.type, genKeystore)
    yield takeLatest(keystoreActions.restore.type, restoreKeystore)
    yield takeLatest(keystoreActions.load.type, loadKeystore)
    yield takeLatest(keystoreActions.destroy.type, destroyKeystore)
    yield takeLatest(keystoreActions.generateAddress.type, generateAddress)
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