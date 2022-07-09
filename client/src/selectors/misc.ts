import { RootState } from '../app/store'
import {
    shouldShowSnackbar as showKeystoreSnackbar,
    getSuccessMessage as getKeystoreSuccessMessage,
    getErrorMessage as getKeystoreErrorMessage,
} from './keystore'
import {
    shouldShowSnackbar as showTransactionSnackbar,
    getSuccessMessage as getTransactionSuccessMessage,
    getErrorMessage as getTransactionErrorMessage,
} from './transaction'


const getIsSnackbarOpen = (state: RootState): boolean => {
    return showKeystoreSnackbar(state) || showTransactionSnackbar(state)
}

const getIsSnackbarError = (state: RootState): boolean => {
    if (showKeystoreSnackbar(state)) {
        return !!getKeystoreErrorMessage(state)
    } else if (showTransactionSnackbar(state)) {
        return !!getTransactionErrorMessage(state)
    } else {
        return false
    }
}

const getSnackbarMessage = (state: RootState): string => {
    let successMessage = null
    let errorMessage = null
    if (showKeystoreSnackbar(state)) {
        successMessage = getKeystoreSuccessMessage(state)
        errorMessage = getKeystoreErrorMessage(state)
    } else if (showTransactionSnackbar(state)) {
        successMessage = getTransactionSuccessMessage(state)
        errorMessage = getTransactionErrorMessage(state)
    }
    return errorMessage ? errorMessage : successMessage ? successMessage : ''
}

export {
    getIsSnackbarOpen,
    getIsSnackbarError,
    getSnackbarMessage,
}