import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3'
})

export function getEthPrice (): Promise<number> {
    return new Promise((resolve, reject) => {
        axiosInstance.get('/simple/price', {
            params: {
                ids: 'ethereum',
                'vs_currencies': 'usd',
            }
        }).then(response => {
            if (response && response.data && response.data.ethereum && response.data.ethereum.usd) {
                return resolve(response.data.ethereum.usd)
            }
            return reject({
                response: {
                    data: {
                        error: 'Cannot get eth price at the moment'
                    }
                }
            })
        }).catch(reject)
    })
}

export function getEthPriceAt (date: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axiosInstance.get('/coins/ethereum/history', {
            params: {
                date,
            }
        }).then(response => {
            if (response && response.data && response.data.market_data && response.data.market_data.current_price) {
                return resolve(response.data.market_data.current_price.usd)
            }
            return reject({
                response: {
                    data: {
                        error: 'Cannot get eth price at the moment'
                    }
                }
            })
        }).catch(reject)
    })
}
