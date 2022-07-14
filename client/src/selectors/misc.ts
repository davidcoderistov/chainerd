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
import {
    shouldShowSnackbar as showAddressSnackbar,
    getSuccessMessage as getAddressSuccessMessage,
    getErrorMessage as getAddressErrorMessage,
} from './address'


const getIsSnackbarOpen = (state: RootState): boolean => {
    return showKeystoreSnackbar(state) || showTransactionSnackbar(state) || showAddressSnackbar(state)
}

const getIsSnackbarError = (state: RootState): boolean => {
    if (showKeystoreSnackbar(state)) {
        return !!getKeystoreErrorMessage(state)
    } else if (showTransactionSnackbar(state)) {
        return !!getTransactionErrorMessage(state)
    } else if (showAddressSnackbar(state)) {
        return !!getAddressErrorMessage(state)
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
    } else if (showAddressSnackbar(state)) {
        successMessage = getAddressSuccessMessage(state)
        errorMessage = getAddressErrorMessage(state)
    }
    return errorMessage ? errorMessage : successMessage ? successMessage : ''
}

export {
    getIsSnackbarOpen,
    getIsSnackbarError,
    getSnackbarMessage,
}