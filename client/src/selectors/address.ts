import { RootState } from '../app/store'
import { STATUS_CODES } from '../sagas/address'

export const getAddresses = (state: RootState) => state.address.addresses

export const getLoading = (state: RootState) => state.address.loading

export const getStatusCode = (state: RootState) => state.address.statusCode

export const getErrorMessage = (state: RootState) => state.address.errorMessage

export const getSuccessMessage = (state: RootState) => state.address.successMessage

export const isGenerateAddressSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.GENERATE_ADDRESS &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

export const isEditAddressSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.EDIT_ADDRESS &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

export const isDeleteAddressSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.DELETE_ADDRESS &&
        !getLoading(state) && !getErrorMessage(state) && getSuccessMessage(state)
}

export const shouldShowSnackbar = (state: RootState) => {
    const statusCode = getStatusCode(state)
    return statusCode === STATUS_CODES.GENERATE_ADDRESS ||
        statusCode === STATUS_CODES.EDIT_ADDRESS ||
        statusCode === STATUS_CODES.DELETE_ADDRESS
}