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

const getError = (state: RootState) => state.keystore.error

const getErrorCode = (state: RootState) => state.keystore.errorCode

const getLoading = (state: RootState) => state.keystore.loading


export {
    getKeystore,
    getAddresses,
    getError,
    getErrorCode,
    getLoading,
}