import { RootState } from '../app/store'
import { roundedWeiToGwei, getNetworkFees } from '../utils'

const getEthAmount = (state: RootState): string => state.transaction.ethAmount

const getFiatAmount = (state: RootState): string => state.transaction.fiatAmount

const getLowGasPrice = (state: RootState): number => roundedWeiToGwei(state.transaction.gasInfo.lowGasPrice)

const getHighGasPrice = (state: RootState): number => roundedWeiToGwei(state.transaction.gasInfo.highGasPrice)

const getGasPrice = (state: RootState): number => state.transaction.gasInfo.gasPrice

const getLoading = (state: RootState): boolean => state.transaction.request.loading

const getEthNetworkFees = (state: RootState): number => getNetworkFees(state.transaction.gasInfo.gasPrice)

const getFiatNetworkFees = (state: RootState): number => (getEthNetworkFees(state) * state.transaction.ethPrice)

const getEthTotalAmount = (state: RootState): number => Number(getEthAmount(state)) + getEthNetworkFees(state)

const getFiatTotalAmount = (state: RootState): number => Number(getFiatAmount(state)) + getFiatNetworkFees(state)

export {
    getEthAmount,
    getFiatAmount,
    getLowGasPrice,
    getHighGasPrice,
    getGasPrice,
    getLoading,
    getEthNetworkFees,
    getFiatNetworkFees,
    getEthTotalAmount,
    getFiatTotalAmount,
}