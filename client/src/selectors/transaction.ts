import { RootState } from '../app/store'
import { roundedWeiToGwei, getNetworkFees } from '../utils'
import { STATUS_CODES } from '../sagas/transaction'

const getEthAmount = (state: RootState): string => state.transaction.ethAmount

const getFiatAmount = (state: RootState): string => state.transaction.fiatAmount

const getLowGasPrice = (state: RootState): number => roundedWeiToGwei(state.transaction.gasInfo.lowGasPrice)

const getHighGasPrice = (state: RootState): number => roundedWeiToGwei(state.transaction.gasInfo.highGasPrice)

const getGasPrice = (state: RootState): number => state.transaction.gasInfo.gasPrice

const getLoading = (state: RootState): boolean => state.transaction.request.loading

const getEthNetworkFees = (state: RootState): number => getNetworkFees(state.transaction.gasInfo.gasPrice)

const getFiatNetworkFees = (state: RootState): number => (getEthNetworkFees(state) * state.transaction.ethPrice)

const getEthTotalAmount = (state: RootState): number => Number(getEthAmount(state)) + getEthNetworkFees(state)

const getFiatTotalAmount = (state: RootState): number => Number(getFiatAmount(state)) + getFiatNetworkFees(state)

const getStatusCode = (state: RootState): number | null => state.transaction.request.statusCode

const getErrorMessage = (state: RootState): string | null => state.transaction.request.errorMessage

const getSuccessMessage = (state: RootState): string | null => state.transaction.request.successMessage

const shouldShowSnackbar = (state: RootState) => {
    const statusCode = getStatusCode(state)
    return statusCode === STATUS_CODES.SEND_TRANSACTION
}

export {
    getEthAmount,
    getFiatAmount,
    getLowGasPrice,
    getHighGasPrice,
    getGasPrice,
    getLoading,
    getEthNetworkFees,
    getFiatNetworkFees,
    getEthTotalAmount,
    getFiatTotalAmount,
    getStatusCode,
    getErrorMessage,
    getSuccessMessage,
    shouldShowSnackbar,
}