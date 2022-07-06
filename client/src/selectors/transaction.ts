import { RootState } from '../app/store'
import { roundedWeiToGwei } from '../utils'

const getEthAmount = (state: RootState): string => state.transaction.ethAmount

const getFiatAmount = (state: RootState): string => state.transaction.fiatAmount

const getLowGasPrice = (state: RootState): number => roundedWeiToGwei(state.transaction.gasInfo.lowGasPrice)

const getHighGasPrice = (state: RootState): number => roundedWeiToGwei(state.transaction.gasInfo.highGasPrice)

const getGasPrice = (state: RootState): number => state.transaction.gasInfo.gasPrice

const getLoading = (state: RootState): boolean => state.transaction.request.loading

export {
    getEthAmount,
    getFiatAmount,
    getLowGasPrice,
    getHighGasPrice,
    getGasPrice,
    getLoading
}