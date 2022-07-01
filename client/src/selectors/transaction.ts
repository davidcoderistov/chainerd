import { RootState } from '../app/store'

const getEthAmount = (state: RootState): string => state.transaction.ethAmount

const getFiatAmount = (state: RootState): string => state.transaction.fiatAmount

const getLoading = (state: RootState): boolean => state.transaction.request.loading

export {
    getEthAmount,
    getFiatAmount,
    getLoading
}