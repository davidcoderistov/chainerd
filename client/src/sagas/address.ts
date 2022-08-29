import { call, put, select, delay, takeLatest } from 'redux-saga/effects'
import { keystoreActions } from '../slices/keystore'
import { addressActions, AddressType } from '../slices/address'
import { getAddresses } from '../selectors/address'
import { getSerializedKeystore, getNetwork } from '../selectors/keystore'
import { keystore } from 'eth-lightwallet'
import { NETWORK } from '../config'
import { getEthPrice, getEthBalances } from '../services'
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
    getErrorMessage,
    toRoundedEth,
    toRoundedFiat,
    distributePercentages,
} from '../utils'
import _intersection from 'lodash/intersection'
import { ethers } from 'ethers'

export const STATUS_CODES = {
    LOAD_ALL: 1,
    GENERATE_ADDRESS: 2,
    EDIT_ADDRESS: 3,
    DELETE_ADDRESS: 4,
    SYNC_ETH_PRICE: 5,
}

export function *loadAll ({ payload }: ReturnType<typeof addressActions.loadAll>) {
    const ks: keystore = deserializeKeystore(payload.keystore)
    const localStorageAddresses = getCurrentAddresses()
    const localStorageAddressAliases = getCurrentAliasByAddress()
    let addresses = ks.getAddresses()
    if (Array.isArray(localStorageAddresses)) {
        addresses = _intersection(addresses, localStorageAddresses)
    }
    try {
        if (addresses.length <= 0) {
            yield put(addressActions.loadAllFulfilled({ addresses: [] }))
            return
        }
        const network: NETWORK = yield select(getNetwork)
        const ethBalances: { [address: string]: string } = yield call(getEthBalances, addresses, network)
        const ethPrice: number = yield call(getEthPrice)
        const mappedAddresses = addresses.map(address => {
            const ethAmount = toRoundedEth(Number(ethers.utils.formatEther(ethers.BigNumber.from(ethBalances[address]))))
            return {
                address,
                alias: localStorageAddressAliases && localStorageAddressAliases.hasOwnProperty(address) ?
                    localStorageAddressAliases[address] : null,
                ethAmount: ethBalances.hasOwnProperty(address) ? Number(ethAmount) : 0,
                fiatAmount: Number(toRoundedFiat(Number(ethAmount) * ethPrice)),
                loading: false,
            }
        })
        const percentages = distributePercentages(mappedAddresses.map(address => address.ethAmount))
        yield put(addressActions.loadAllFulfilled({
            addresses: mappedAddresses.map((address, index) => ({
                ...address,
                percentage: percentages[index]
            }))
        }))
    } catch (error: any) {
        yield put(addressActions.rejected({
            statusCode: STATUS_CODES.LOAD_ALL,
            errorMessage: getErrorMessage(error, 'Cannot get eth balances at the moment')
        }))
    }
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
        const addresses: AddressType[] = yield select(getAddresses)
        const filteredAddresses = addresses.filter(address => address.address !== payload.address)
        const percentages = distributePercentages(filteredAddresses.map(address => address.ethAmount))
        yield put(addressActions.loadAllFulfilled({
            addresses: filteredAddresses.map((address, index) => ({
                ...address,
                percentage: percentages[index]
            }))
        }))
    } catch (error: any) {
        yield put(addressActions.rejected({
            statusCode: STATUS_CODES.DELETE_ADDRESS,
            errorMessage: getErrorMessage(error, 'Address could not be deleted. Please try again later')
        }))
    }
}

export function *syncEthPrice () {
    try {
        const ethPrice: number = yield call(getEthPrice)
        const addresses: AddressType[] = yield select(getAddresses)
        yield put(addressActions.syncFulfilled({
            addresses: addresses.map(address => ({
                ...address,
                fiatAmount: Number(toRoundedFiat(address.ethAmount * ethPrice))
            })),
            successMessage: 'Eth price synced',
            statusCode: STATUS_CODES.SYNC_ETH_PRICE,
        }))
    } catch (error: any) {
        yield put(addressActions.rejected({
            statusCode: STATUS_CODES.SYNC_ETH_PRICE,
            errorMessage: getErrorMessage(error, 'Eth price could not be synced. Please try again later')
        }))
    }
}

export default function *watchAddress () {
    yield takeLatest(addressActions.loadAll.type, loadAll)
    yield takeLatest(addressActions.generate.type, generateAddress)
    yield takeLatest(addressActions.edit.type, editAddress)
    yield takeLatest(addressActions.delete.type, deleteAddress)
    yield takeLatest(addressActions.syncEthPrice.type, syncEthPrice)
}

