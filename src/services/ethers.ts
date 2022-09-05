import { ethers } from 'ethers'
import { getEthersProvider } from '../providers'
import { NETWORK } from '../config'

export function getEthBalance (address: string, blockNumber: string, network: NETWORK): Promise<string> {
    return getEthersProvider(network).send('eth_getBalance', [address, blockNumber])
}

export function sendTransaction (signedTx: string, network: NETWORK): Promise<ethers.providers.TransactionResponse> {
    return getEthersProvider(network).sendTransaction(signedTx)
}

export function waitForTransaction (hash: string, network: NETWORK): Promise<ethers.providers.TransactionReceipt> {
    return getEthersProvider(network).waitForTransaction(hash)
}

export function getBlock (blockNumber: number, network: NETWORK): Promise<ethers.providers.Block> {
    return getEthersProvider(network).getBlock(blockNumber)
}