import { RootState } from '../app/store'
import { keystore } from 'eth-lightwallet'
import { STATUS_CODES } from '../sagas/keystore'
import { deserializeKeystore } from '../sagas/keystore'

const getKeystore = (state: RootState): keystore | null => {
    const ks = state.keystore.keystore
    if (ks) {
        return deserializeKeystore(ks)
    }
    return null
}

const getAddresses = (state: RootState): string[] => {
    const ks = state.keystore.keystore
    if (ks) {
        const deserialized = deserializeKeystore(ks)
        return deserialized.getAddresses()
    }
    return []
}

const getLoading = (state: RootState) => state.keystore.loading

const getStatusCode = (state: RootState) => state.keystore.statusCode

const getErrorMessage = (state: RootState) => state.keystore.errorMessage

const getSuccessMessage = (state: RootState) => state.keystore.successMessage

const isGenerateKeystoreSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.GENERATE_KEYSTORE &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

const isRestoreKeystoreSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.RESTORE_KEYSTORE &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

const isGenerateAddressSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.GENERATE_ADDRESS &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

const isEditAddressSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.EDIT_ADDRESS &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

const shouldShowSnackbar = (state: RootState) => {
    const statusCode = getStatusCode(state)
    return statusCode === STATUS_CODES.GENERATE_KEYSTORE ||
        statusCode === STATUS_CODES.RESTORE_KEYSTORE ||
        statusCode === STATUS_CODES.GENERATE_ADDRESS ||
        statusCode === STATUS_CODES.DESTROY_KEYSTORE ||
        statusCode === STATUS_CODES.EDIT_ADDRESS
}

export {
    getKeystore,
    getAddresses,
    getLoading,
    getStatusCode,
    getErrorMessage,
    getSuccessMessage,
    isGenerateKeystoreSuccess,
    isRestoreKeystoreSuccess,
    isGenerateAddressSuccess,
    isEditAddressSuccess,
    shouldShowSnackbar,
}