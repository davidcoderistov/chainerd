import { ethers } from 'ethers'


export function roundedWeiToGwei (value: number): number {
    return Math.round(parseFloat(ethers.utils.formatUnits(ethers.BigNumber.from(value), 'gwei')))
}