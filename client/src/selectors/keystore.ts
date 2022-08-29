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

export const isError = (state: RootState) => !getLoading(state) && !getSuccessMessage(state) && !!getErrorMessage(state)

export const isSuccess = (state: RootState) => !getLoading(state) && !getErrorMessage(state) && !!getSuccessMessage(state)

export const isGenerateKeystoreSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.GENERATE_KEYSTORE && isSuccess(state)
}

export const isGenerateKeystoreError = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.GENERATE_KEYSTORE && isError(state)
}

export const isRestoreKeystoreSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.RESTORE_KEYSTORE && isSuccess(state)
}

export const isRestoreKeystoreError = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.RESTORE_KEYSTORE && isError(state)
}

export const isDestroyKeystoreSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.DESTROY_KEYSTORE && isSuccess(state)
}

export const shouldShowSnackbar = (state: RootState) => {
    return isGenerateKeystoreSuccess(state) || isGenerateKeystoreError(state) ||
        isRestoreKeystoreSuccess(state) || isRestoreKeystoreError(state) || isDestroyKeystoreSuccess(state)
}