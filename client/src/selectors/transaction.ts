import { RootState } from '../app/store'
import { roundedWeiToGwei, getNetworkFees } from '../utils'
import { STATUS_CODES } from '../sagas/transaction'

export const getEthAmount = (state: RootState): string => state.transaction.ethAmount

export const getFiatAmount = (state: RootState): string => state.transaction.fiatAmount

export const getLowGasPrice = (state: RootState): number => roundedWeiToGwei(state.transaction.gasInfo.lowGasPrice)

export const getHighGasPrice = (state: RootState): number => roundedWeiToGwei(state.transaction.gasInfo.highGasPrice)

export const getGasPrice = (state: RootState): number => state.transaction.gasInfo.gasPrice

export const getLoading = (state: RootState): boolean => state.transaction.request.loading

export const getEthNetworkFees = (state: RootState): number => getNetworkFees(state.transaction.gasInfo.gasPrice)

export const getFiatNetworkFees = (state: RootState): number => (getEthNetworkFees(state) * state.transaction.ethPrice)

export const getEthTotalAmount = (state: RootState): number => Number(getEthAmount(state)) + getEthNetworkFees(state)

export const getFiatTotalAmount = (state: RootState): number => Number(getFiatAmount(state)) + getFiatNetworkFees(state)

export const getStatusCode = (state: RootState): number | null => state.transaction.request.statusCode

export const getErrorMessage = (state: RootState): string | null => state.transaction.request.errorMessage

export const getSuccessMessage = (state: RootState): string | null => state.transaction.request.successMessage

export const isError = (state: RootState) => !getLoading(state) && !getSuccessMessage(state) && !!getErrorMessage(state)

export const isSuccess = (state: RootState) => !getLoading(state) && !getErrorMessage(state) && !!getSuccessMessage(state)

export const isSendTransactionSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.SEND_TRANSACTION && isSuccess(state)
}

export const isSendTransactionError = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.SEND_TRANSACTION && isError(state)
}

export const shouldShowSnackbar = (state: RootState) => {
    return isSendTransactionSuccess(state) || isSendTransactionError(state)
}