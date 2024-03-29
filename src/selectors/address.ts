import { RootState } from '../app/store'
import { STATUS_CODES } from '../sagas/address'

export const getAddresses = (state: RootState) => state.address.addresses

export const getLoading = (state: RootState) => state.address.loading

export const getAddressesLoading = (state: RootState) => state.address.addressesLoading

export const getSyncing = (state: RootState) => state.address.syncing

export const getStatusCode = (state: RootState) => state.address.statusCode

export const getErrorMessage = (state: RootState) => state.address.errorMessage

export const getSuccessMessage = (state: RootState) => state.address.successMessage

export const isError = (state: RootState) => !getLoading(state) && !getSuccessMessage(state) && !!getErrorMessage(state)

export const isSuccess = (state: RootState) => !getLoading(state) && !getErrorMessage(state) && !!getSuccessMessage(state)

export const isLoadAddressesError = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.LOAD_ALL && isError(state)
}

export const isGenerateAddressSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.GENERATE_ADDRESS && isSuccess(state)
}

export const isGenerateAddressError = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.GENERATE_ADDRESS && isError(state)
}

export const isEditAddressSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.EDIT_ADDRESS && isSuccess(state)
}

export const isEditAddressError = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.EDIT_ADDRESS && isError(state)
}

export const isDeleteAddressSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.DELETE_ADDRESS && isSuccess(state)
}

export const isDeleteAddressError = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.DELETE_ADDRESS && isError(state)
}

export const isSyncPriceSuccess = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.SYNC_ETH_PRICE && !getSyncing(state) && !getErrorMessage(state) && !!getSuccessMessage(state)
}

export const isSyncPriceError = (state: RootState) => {
    return getStatusCode(state) === STATUS_CODES.SYNC_ETH_PRICE && !getSyncing(state) && !getSuccessMessage(state) && !!getErrorMessage(state)
}

export const shouldShowSnackbar = (state: RootState) => {
    return isGenerateAddressSuccess(state) || isGenerateAddressError(state) ||
        isEditAddressSuccess(state) || isEditAddressError(state) ||
        isDeleteAddressSuccess(state) || isDeleteAddressError(state) || isLoadAddressesError(state) ||
        isSyncPriceSuccess(state) || isSyncPriceError(state)
}