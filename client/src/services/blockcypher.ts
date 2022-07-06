import axios from 'axios'

export interface GasInfo {
    lowGasPrice: number
    mediumGasPrice: number
    highGasPrice: number
}

export function getGasInfo (): Promise<GasInfo> {
    return new Promise<GasInfo>((resolve , reject) => {
        axios.get('https://api.blockcypher.com/v1/eth/main').then(response => {
            if (response && response.data) {
                const data = response.data
                if (data.hasOwnProperty('low_gas_price') &&
                    data.hasOwnProperty('medium_gas_price') &&
                    data.hasOwnProperty('high_gas_price')) {
                    return resolve({
                        lowGasPrice: data.low_gas_price,
                        mediumGasPrice: data.medium_gas_price,
                        highGasPrice: data.high_gas_price
                    })
                }
            }
            return reject({
                response: {
                    data: {
                        error: 'Cannot get gas price info at the moment'
                    }
                }
            })
        }).catch(reject)
    })
}