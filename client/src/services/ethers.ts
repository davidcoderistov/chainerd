import { ethersProvider } from '../providers'

export function getEthBalance (address: string, blockNumber: string): Promise<string> {
    return ethersProvider.send('eth_getBalance', [address, blockNumber])
}