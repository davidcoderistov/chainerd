import { call, put, select, delay, takeLatest } from 'redux-saga/effects'
import { keystoreActions } from '../slices/keystore'
import { addressActions } from '../slices/address'
import { getSerializedKeystore } from '../selectors/keystore'
import { keystore } from 'eth-lightwallet'
import {
    getCurrentSerializedKeystore,
    getCurrentAddresses,
    getCurrentAliasByAddress,
    addAddress as localStorageAddAddress,
    editAddress as localStorageEditAddress,
    deleteAddress as localStorageDeleteAddress,
} from '../localStorage'
import {
    keyFromPassword,
    deserializeKeystore,
    getErrorMessage
} from '../utils'
import _intersection from 'lodash/intersection'

export const STATUS_CODES = {
    LOAD_ALL: 1,
    GENERATE_ADDRESS: 2,
    EDIT_ADDRESS: 3,
    DELETE_ADDRESS: 4,
}

export function *loadAll ({ payload }: ReturnType<typeof addressActions.loadAll>) {
    const ks: keystore = deserializeKeystore(payload.keystore)
    const localStorageAddresses = getCurrentAddresses()
    const localStorageAddressAliases = getCurrentAliasByAddress()
    let addresses = ks.getAddresses()
    if (Array.isArray(localStorageAddresses)) {
        addresses = _intersection(addresses, localStorageAddresses)
    }
    yield put(addressActions.loadAllFulfilled({
        addresses: addresses.map(address => ({
            address,
            alias: localStorageAddressAliases && localStorageAddressAliases.hasOwnProperty(address) ?
                localStorageAddressAliases[address] : null,
            ethAmount: 0.3327,
            fiatAmount: 359.36,
            loading: false,
        }))
    }))
}

export function *generateAddress ({ payload }: ReturnType<typeof addressActions.generate>) {
    yield put(addressActions.pending())
    const reduxSerializedKs: string | null = yield select(getSerializedKeystore)
    const localStorageSerializedKs: string | null = getCurrentSerializedKeystore()
    if (!reduxSerializedKs || !localStorageSerializedKs || reduxSerializedKs !== localStorageSerializedKs) {
        yield put(addressActions.rejected({
            statusCode: STATUS_CODES.GENERATE_ADDRESS,
            errorMessage: 'Can\'t generate address, wallet not initialized'
        }))
        return
    }
    const ks: keystore = deserializeKeystore(reduxSerializedKs)
    try {
        const pwDerivedKey: Uint8Array = yield call(keyFromPassword, ks, payload.password)
        const { ksSerialized, address } = localStorageAddAddress(pwDerivedKey)
        yield put(addressActions.add({
            address,
            statusCode: STATUS_CODES.GENERATE_ADDRESS,
            successMessage: 'Address successfully added',
        }))
        yield put(keystoreActions.set({
            keystore: ksSerialized,
        }))
    } catch (error: any) {
        yield put(addressActions.rejected({
            statusCode: STATUS_CODES.GENERATE_ADDRESS,
            errorMessage: getErrorMessage(error, 'Address could not be generated. Please try again later')
        }))
    }
}

export function *editAddress ({ payload }: ReturnType<typeof addressActions.edit>) {
    yield put(addressActions.pending())
    yield delay(300)
    const reduxSerializedKs: string | null = yield select(getSerializedKeystore)
    const localStorageSerializedKs: string | null = getCurrentSerializedKeystore()
    if (!reduxSerializedKs || !localStorageSerializedKs || reduxSerializedKs !== localStorageSerializedKs) {
        yield put(addressActions.rejected({
            statusCode: STATUS_CODES.EDIT_ADDRESS,
            errorMessage: 'Can\'t edit address, wallet not initialized'
        }))
        return
    }
    try {
        localStorageEditAddress(payload.address, payload.alias)
        yield put(addressActions.editFulfilled({
            address: payload.address,
            alias: payload.alias,
            statusCode: STATUS_CODES.EDIT_ADDRESS,
            successMessage: 'Address successfully edited',
        }))
    } catch (error: any) {
        yield put(addressActions.rejected({
            statusCode: STATUS_CODES.EDIT_ADDRESS,
            errorMessage: getErrorMessage(error, 'Address could not be edited. Please try again later')
        }))
    }
}

export function *deleteAddress ({ payload }: ReturnType<typeof addressActions.delete>) {
    yield put(addressActions.pending())
    yield delay(300)
    const reduxSerializedKs: string | null = yield select(getSerializedKeystore)
    const localStorageSerializedKs: string | null = getCurrentSerializedKeystore()
    if (!reduxSerializedKs || !localStorageSerializedKs || reduxSerializedKs !== localStorageSerializedKs) {
        yield put(addressActions.rejected({
            statusCode: STATUS_CODES.DELETE_ADDRESS,
            errorMessage: 'Can\'t delete address, wallet not initialized'
        }))
        return
    }
    try {
        localStorageDeleteAddress(payload.address)
        yield put(addressActions.deleteFulfilled({
            address: payload.address,
            statusCode: STATUS_CODES.DELETE_ADDRESS,
            successMessage: 'Address successfully deleted',
        }))
    } catch (error: any) {
        yield put(addressActions.rejected({
            statusCode: STATUS_CODES.DELETE_ADDRESS,
            errorMessage: getErrorMessage(error, 'Address could not be deleted. Please try again later')
        }))
    }
}

export default function *watchAddress () {
    yield takeLatest(addressActions.loadAll.type, loadAll)
    yield takeLatest(addressActions.generate.type, generateAddress)
    yield takeLatest(addressActions.edit.type, editAddress)
    yield takeLatest(addressActions.delete.type, deleteAddress)
}

