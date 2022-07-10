import { ethers } from 'ethers'

const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY

const ethersProvider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${INFURA_API_KEY}`)

export {
    ethersProvider
}