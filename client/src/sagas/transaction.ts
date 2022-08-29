import { call, put, debounce, select, delay, takeLatest } from 'redux-saga/effects'
import { transactionActions } from '../slices/transaction'
import { accountActions } from '../slices/account'
import { portfolioActions } from '../slices/portfolio'
import { addressActions, AddressType } from '../slices/address'
import { getKeystore } from '../selectors/keystore'
import { getAddresses } from '../selectors/address'
import { getNetwork } from '../selectors/network'
import { getAllTransactionsByAddress, getTransactionsFetched } from '../selectors/account'
import { Transaction as AccountTransaction } from '../slices/account'
import { getLatestTransactions, getLatestTransactionsFetched } from '../selectors/portfolio'
import { Transaction as LatestTransaction } from '../slices/portfolio'
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
    distributePercentages,
} from '../utils'
import { getNonce, incrementNonce } from '../localStorage'
import { keystore, signing } from 'eth-lightwallet'
import { NETWORK } from '../config'
import { ethers } from 'ethers'
import { sendTransaction as sendTx, waitForTransaction, getBlock } from '../services'
import _orderBy from 'lodash/orderBy'

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
        yield put(transactionActions.setActiveStep({ step: 1 }))
        const network: NETWORK = yield select(getNetwork)
        const txResponse: ethers.providers.TransactionResponse = yield call(sendTx, `0x${signedTx}`, network)
        yield put(transactionActions.setHash({ hash: txResponse.hash || null }))
        yield put(transactionActions.setActiveStep({ step: 2 }))
        const txReceipt: ethers.providers.TransactionReceipt = yield call(waitForTransaction, txResponse.hash, network)
        yield delay(3000)
        incrementNonce(payload.fromAddress)
        if (txResponse.hash && txReceipt.status) {
            yield put(transactionActions.setActiveStep({ step: 3 }))
            yield put(transactionActions.fulfilled({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                successMessage: 'Transaction successfully mined',
            }))
            if (txReceipt.blockNumber) {
                const ethPrice: number = yield call(getEthPrice)
                const { timestamp }: ethers.providers.Block = yield call(getBlock, txReceipt.blockNumber, network)
                const ethAmount = toRoundedEth(Number(ethers.utils.formatEther(ethers.BigNumber.from(txResponse.value))))
                const transaction = {
                    from: payload.fromAddress,
                    to: payload.toAddress,
                    hash: txResponse.hash,
                    timestamp: timestamp.toString(),
                    value: toRoundedFiat(ethPrice * Number(ethAmount)),
                    amount: ethAmount,
                    blockNumber: txReceipt.blockNumber.toString(),
                    status: '1',
                    fee: toRoundedEth(
                        Number(ethers.utils.formatEther(ethers.BigNumber.from(txReceipt.gasUsed).mul(ethers.BigNumber.from(txResponse.gasPrice))))
                    )
                }
                const addresses: AddressType[] = yield select(getAddresses)
                const totalAmount = Number(transaction.amount) + Number(transaction.fee)
                const newAddresses = addresses.map((address, index) => {
                    const ethAmount = Number(toRoundedEth(address.ethAmount - totalAmount))
                    return {
                        ...address,
                        ethAmount,
                        fiatAmount: Number(toRoundedFiat(Number(ethAmount) * ethPrice)),
                    }
                })
                const percentages = distributePercentages(newAddresses.map(address => address.ethAmount))
                yield put(addressActions.loadAllFulfilled({
                    addresses: newAddresses.map((address, index) => ({
                        ...address,
                        percentage: percentages[index]
                    }))
                }))
                const accountTxsFetched: boolean = yield select(getTransactionsFetched)
                const latestTxsFetched: boolean = yield select(getLatestTransactionsFetched)
                if (accountTxsFetched) {
                    const transactions: AccountTransaction[] = yield select(getAllTransactionsByAddress)
                    yield put(accountActions.fetchTransactionsFulfilled({
                        address: payload.fromAddress,
                        data: _orderBy([...transactions, transaction], 'timestamp', 'desc')
                    }))
                }
                if (latestTxsFetched) {
                    const transactions: LatestTransaction[] = yield select(getLatestTransactions)
                    const newTxs = transactions.length >= 5 ? Array.from(transactions).slice(0, transactions.length - 1) : transactions
                    yield put(portfolioActions.fetchLatestTransactionsFulfilled({
                        transactions: [transaction, ...newTxs]
                    }))
                }
            }
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