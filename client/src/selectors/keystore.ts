import { RootState } from '../app/store'


const getKeystore = (state: RootState) => state.keystore.keystore

const getError = (state: RootState) => state.keystore.error

const getErrorCode = (state: RootState) => state.keystore.errorCode

const getLoading = (state: RootState) => state.keystore.loading


export {
    getKeystore,
    getError,
    getErrorCode,
    getLoading,
}