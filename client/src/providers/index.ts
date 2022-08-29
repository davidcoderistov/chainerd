import { ethers } from 'ethers'
import { NETWORK } from '../config'

const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY

export function getEthersProvider (network: NETWORK) {
    return new ethers.providers.JsonRpcProvider(`https://${network}.infura.io/v3/${INFURA_API_KEY}`)
}