import { call, put, debounce, select, takeLatest } from 'redux-saga/effects'
import { transactionActions } from '../slices/transaction'
import { getKeystore } from '../selectors/keystore'
import { getEthAmount, getGasPrice } from '../selectors/transaction'
import { getEthPrice, getGasInfo } from '../services'
import {
    keyFromPassword,
    roundedWeiToGwei,
    toRoundedEth,
    toRoundedFiat,
    getAxiosErrorMessage,
    getGenericErrorMessage,
    getRawTransaction,
} from '../utils'
import { getNonce, incrementNonce } from '../localStorage'
import { keystore, signing } from 'eth-lightwallet'
import { ethersProvider } from '../providers'
import { ethers } from 'ethers'

export const STATUS_CODES = {
    GET_ETH_PRICE: 1,
    SET_GAS_INFO: 2,
    SEND_TRANSACTION: 3,
}

export function *setAmount (calcAmount: (ethPrice: number, isFiat: boolean) => string) {
    try {
        const ethPrice: number = yield call(getEthPrice)
        yield put(transactionActions.setAmountFulfilled({
            statusCode: STATUS_CODES.GET_ETH_PRICE,
            successMessage: 'Eth price successfully fetched',
            ethAmount: calcAmount(ethPrice, false),
            fiatAmount: calcAmount(ethPrice, true),
            ethPrice,
        }))
    } catch (error: any) {
        yield put(transactionActions.rejected({
            statusCode: STATUS_CODES.GET_ETH_PRICE,
            errorMessage: getAxiosErrorMessage(error, 'Cannot get eth price at the moment'),
        }))
    }
}

export function *setEthAmount ({ payload }: ReturnType<typeof transactionActions.setEthAmount>) {
    yield call(setAmount, (ethPrice: number, isFiat: boolean) => {
        if (isFiat) {
            const ethAmount = parseFloat(payload.ethAmount)
            if (!isNaN(ethAmount)) {
                return toRoundedFiat(ethAmount * ethPrice)
            }
            return ''
        }
        return payload.ethAmount
    })
}

export function *setFiatAmount ({ payload }: ReturnType<typeof transactionActions.setFiatAmount>) {
    yield call(setAmount, (ethPrice: number, isFiat: boolean) => {
        if (!isFiat) {
            const fiatAmount = parseFloat(payload.fiatAmount)
            if (!isNaN(fiatAmount)) {
                return toRoundedEth(fiatAmount / ethPrice)
            }
            return ''
        }
        return payload.fiatAmount
    })
}

export function *setGasInfo () {
    yield put(transactionActions.pending())
    try {
        const { lowGasPrice, mediumGasPrice, highGasPrice } = yield call(getGasInfo)
        yield put(transactionActions.setGasInfoFulfilled({
            lowGasPrice,
            gasPrice: roundedWeiToGwei(mediumGasPrice),
            highGasPrice,
            statusCode: STATUS_CODES.SET_GAS_INFO,
            successMessage: 'Gas info successfully fetched'
        }))
    } catch (error: any) {
        yield put(transactionActions.rejected({
            statusCode: STATUS_CODES.SET_GAS_INFO,
            errorMessage: getAxiosErrorMessage(error, 'Cannot get gas info at the moment'),
        }))
    }
}

export function *sendTransaction ({ payload }: ReturnType<typeof transactionActions.sendTransaction>) {
    yield put(transactionActions.pending())
    const ks: keystore = yield select(getKeystore)
    if (!ks) {
        yield put(transactionActions.rejected({
            statusCode: STATUS_CODES.SEND_TRANSACTION,
            errorMessage: 'Wallet is not initialized',
        }))
        return
    }
    try {
        const pwDerivedKey: Uint8Array = yield call(keyFromPassword, ks, payload.password)
        if (!ks.isDerivedKeyCorrect(pwDerivedKey)) {
            yield put(transactionActions.rejected({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                errorMessage: 'Incorrect derived key !',
            }))
            return
        }
        const ethAmount: string = yield select(getEthAmount)
        const gasPrice: number = yield select(getGasPrice)
        const nonce = getNonce(payload.fromAddress)
        if (nonce === null) {
            yield put(transactionActions.rejected({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                errorMessage: 'Cannot infer address nonce',
            }))
            return
        }
        const rawTx = getRawTransaction({
            to: payload.toAddress,
            value: ethers.utils.parseUnits(ethAmount, 'ether'),
            gasPrice: ethers.utils.parseUnits(gasPrice.toString(), 'gwei'),
            nonce,
            gasLimit: 21000,
        })
        const signedTx = signing.signTx(ks, pwDerivedKey, rawTx, payload.fromAddress)
        const { hash } = yield call([ethersProvider, ethersProvider.sendTransaction], `0x${signedTx}`)
        incrementNonce(payload.fromAddress)
        if (hash) {
            yield put(transactionActions.fulfilled({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                successMessage: `Transaction ${hash} successfully sent`,
            }))
        } else {
            yield put(transactionActions.rejected({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                errorMessage: 'Something went wrong while trying to send the transaction',
            }))
        }
    } catch(error: any) {
        yield put(transactionActions.rejected({
            statusCode: STATUS_CODES.SEND_TRANSACTION,
            errorMessage: getGenericErrorMessage(error, 'Something went wrong while trying to send the transaction')
        }))
    }
}

export default function *watchTransaction () {
    yield debounce(500, transactionActions.setEthAmount.type, setEthAmount)
    yield debounce(500, transactionActions.setFiatAmount.type, setFiatAmount)
    yield takeLatest(transactionActions.setGasInfo.type, setGasInfo)
    yield takeLatest(transactionActions.sendTransaction.type, sendTransaction)
}