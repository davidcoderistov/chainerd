import axios from 'axios'

const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY

const axiosInstance = axios.create({
    baseURL: 'https://api.etherscan.io/api'
})

export function getEthBalances (addresses: string[]): Promise<{ [address: string]: string }> {
    return new Promise((resolve, reject) => {
        axiosInstance.get('', {
            params: {
                module: 'account',
                action: 'balancemulti',
                address: addresses.join(','),
                tag: 'latest',
                apikey: ETHERSCAN_API_KEY,
            }
        }).then(response => {
            if (response && response.data && Array.isArray(response.data.result)) {
                return resolve(
                    response.data.result.reduce((accum: { [address: string]: string }, curr: { account: string, balance: string }) => ({
                        ...accum,
                        [curr.account]: curr.balance
                    }), {})
                )
            }
            return reject({
                response: {
                    data: {
                        error: 'Cannot get eth balances at the moment'
                    }
                }
            })
        }).catch(reject)
    })
}