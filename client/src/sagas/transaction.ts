import { call, put, debounce } from 'redux-saga/effects'
import { transactionActions } from '../slices/transaction'
import { getEthPrice } from '../services'

export const STATUS_CODES = {
    GET_ETH_PRICE: 1,
}

function getErrorMessage(error: any, defaultMessage: string): string {
    return error && error.response && error.response.data && error.response.data.error ?
        error.response.data.error : defaultMessage
}

function *setAmount (calcAmount: (ethPrice: number, isFiat: boolean) => string) {
    try {
        const ethPrice: number = yield call(getEthPrice)
        yield put(transactionActions.setAmountFulfilled({
            statusCode: STATUS_CODES.GET_ETH_PRICE,
            successMessage: 'Eth price successfully fetched',
            ethAmount: calcAmount(ethPrice, false),
            fiatAmount: calcAmount(ethPrice, true),
        }))
    } catch (error: any) {
        yield put(transactionActions.setAmountRejected({
            statusCode: STATUS_CODES.GET_ETH_PRICE,
            errorMessage: getErrorMessage(error, 'Cannot get eth price at the moment'),
        }))
    }
}

function *setEthAmount ({ payload }: ReturnType<typeof transactionActions.setEthAmount>) {
    yield call(setAmount, (ethPrice: number, isFiat: boolean) => {
        if (isFiat) {
            const ethAmount = parseFloat(payload.ethAmount)
            if (!isNaN(ethAmount)) {
                return (ethAmount * ethPrice).toFixed(2)
            }
            return ''
        }
        return payload.ethAmount
    })
}

function *setFiatAmount ({ payload }: ReturnType<typeof transactionActions.setFiatAmount>) {
    yield call(setAmount, (ethPrice: number, isFiat: boolean) => {
        if (!isFiat) {
            const fiatAmount = parseFloat(payload.fiatAmount)
            if (!isNaN(fiatAmount)) {
                return (fiatAmount / ethPrice).toFixed(2)
            }
            return ''
        }
        return payload.fiatAmount
    })
}

function *watchTransaction () {
    yield debounce(500, transactionActions.setEthAmount.type, setEthAmount)
    yield debounce(500, transactionActions.setFiatAmount.type, setFiatAmount)
}

export {
    watchTransaction
}

