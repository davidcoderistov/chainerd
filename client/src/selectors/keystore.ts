import { RootState } from '../app/store'
import { keystore } from 'eth-lightwallet'
import { STATUS_CODES } from '../sagas/keystore'
import { getCurrentAddresses, getCurrentAddressAliases } from '../localStorage'
import { deserializeKeystore } from '../utils'
import _intersection from 'lodash/intersection'

const getKeystore = (state: RootState): keystore | null => {
    const ks = state.keystore.keystore
    if (ks) {
        return deserializeKeystore(ks)
    }
    return null
}

const getAddresses = (state: RootState): Array<{ address: string, alias: string | null }> => {
    const ks = state.keystore.keystore
    if (ks) {
        const deserialized = deserializeKeystore(ks)
        let keystoreAddresses = deserialized.getAddresses()
        const storeAddresses = getCurrentAddresses()
        const storeAddressAliases = getCurrentAddressAliases()
        if (Array.isArray(storeAddresses)) {
           keystoreAddresses = _intersection(keystoreAddresses, storeAddresses)
        }
        return keystoreAddresses.map(address => ({
            address,
            alias: storeAddressAliases && storeAddressAliases.hasOwnProperty(address) ? storeAddressAliases[address] : null,
        }))
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

const isDeleteAddressSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.DELETE_ADDRESS &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

const shouldShowSnackbar = (state: RootState) => {
    const statusCode = getStatusCode(state)
    return statusCode === STATUS_CODES.GENERATE_KEYSTORE ||
        statusCode === STATUS_CODES.RESTORE_KEYSTORE ||
        statusCode === STATUS_CODES.GENERATE_ADDRESS ||
        statusCode === STATUS_CODES.DESTROY_KEYSTORE ||
        statusCode === STATUS_CODES.EDIT_ADDRESS ||
        statusCode === STATUS_CODES.DELETE_ADDRESS
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
    isDeleteAddressSuccess,
    shouldShowSnackbar,
}