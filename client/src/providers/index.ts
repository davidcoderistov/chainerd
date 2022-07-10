import { ethers } from 'ethers'

const INFURA_API_KEYS = process.env.REACT_APP_INFURA_API_KEYS

const ethersProvider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${INFURA_API_KEYS}`)

export {
    ethersProvider
}