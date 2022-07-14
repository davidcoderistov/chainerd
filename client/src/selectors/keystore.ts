import { RootState } from '../app/store'
import { keystore } from 'eth-lightwallet'
import { STATUS_CODES } from '../sagas/keystore'
import { deserializeKeystore } from '../utils'

export const getKeystore = (state: RootState): keystore | null => {
    const ks = state.keystore.keystore
    if (ks) {
        return deserializeKeystore(ks)
    }
    return null
}

export const getSerializedKeystore = (state: RootState): string | null => state.keystore.keystore

export const getLoading = (state: RootState) => state.keystore.loading

export const getStatusCode = (state: RootState) => state.keystore.statusCode

export const getErrorMessage = (state: RootState) => state.keystore.errorMessage

export const getSuccessMessage = (state: RootState) => state.keystore.successMessage

export const isGenerateKeystoreSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.GENERATE_KEYSTORE &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

export const isRestoreKeystoreSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.RESTORE_KEYSTORE &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

export const shouldShowSnackbar = (state: RootState) => {
    const statusCode = getStatusCode(state)
    return statusCode === STATUS_CODES.GENERATE_KEYSTORE ||
        statusCode === STATUS_CODES.RESTORE_KEYSTORE ||
        statusCode === STATUS_CODES.DESTROY_KEYSTORE
}