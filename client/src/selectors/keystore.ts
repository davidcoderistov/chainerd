import { RootState } from '../app/store'
import { keystore } from 'eth-lightwallet'
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


export {
    getKeystore,
    getAddresses,
    getLoading,
    getStatusCode,
    getErrorMessage,
}