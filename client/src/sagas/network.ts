import { put, takeLatest } from 'redux-saga/effects'
import { keystoreActions } from '../slices/keystore'
import { addressActions } from '../slices/address'
import { accountActions } from '../slices/account'
import { transactionActions } from '../slices/transaction'
import { portfolioActions } from '../slices/portfolio'
import { networkActions } from '../slices/network'
import {
    getCurrentSerializedKeystore,
} from '../localStorage'


export function *setNetwork () {
    yield put(accountActions.clearAll())
    yield put(addressActions.clearAll())
    yield put(portfolioActions.clearAll())
    yield put(transactionActions.clearAll())
    const ks = getCurrentSerializedKeystore()
    if (ks) {
        yield put(keystoreActions.load({ keystore: ks }))
    }
}

export default function *watchNetwork () {
    yield takeLatest(networkActions.setNetwork.type, setNetwork)
}