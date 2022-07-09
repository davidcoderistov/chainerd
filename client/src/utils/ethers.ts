import { ethers } from 'ethers'
import { UnsignedTransaction } from 'ethers'


export function roundedWeiToGwei (value: number): number {
    return Math.round(parseFloat(ethers.utils.formatUnits(ethers.BigNumber.from(value), 'gwei')))
}

export function getNetworkFees (gasPrice: number, units: string = 'gwei', gasLimit: number = 21000): number {
    return Number(ethers.utils.formatEther(ethers.utils.parseUnits(gasPrice.toString(), units).mul(gasLimit)))
}

export function toRounded (number: number, precision = 5): string {
    return parseFloat(number.toFixed(precision)).toString()
}

export function toRoundedEth (number: number): string {
    return toRounded(number, 6)
}

export function toRoundedFiat (number: number): string {
    return toRounded(number, 2)
}

export function getRawTransaction (tx: UnsignedTransaction): string {
    return ethers.utils.serializeTransaction(tx)
}