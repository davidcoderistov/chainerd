import axios from 'axios'

const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY

const axiosInstance = axios.create({
    baseURL: 'https://api-kovan.etherscan.io/api'
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

export function getBlockNumber (timestamp: number): Promise<string> {
    return new Promise((resolve, reject) => {
        axiosInstance.get('', {
            params: {
                module: 'block',
                action: 'getblocknobytime',
                timestamp,
                closest: 'before',
                apikey: ETHERSCAN_API_KEY,
            }
        }).then(response => {
            if (response && response.data && response.data.result) {
                return resolve(response.data.result)
            }
            return reject({
                response: {
                    data: {
                        error: 'Cannot get block number at the moment'
                    }
                }
            })
        }).catch(reject)
    })
}

export interface Transaction {
    blockHash: string
    blockNumber: string
    cumulativeGasUsed: string
    from: string
    gas: string
    gasPrice: string
    gasUsed: string
    hash: string
    nonce: string
    timestamp: string
    to: string
    value: string
    status: string
}

export function getTransactions ({ address, page, offset, sort = 'asc', startBlock, endBlock }: {
    address: string,
    page?: number,
    offset?: number,
    sort?: 'asc' | 'desc',
    startBlock?: string,
    endBlock?: string }): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
        axiosInstance.get('', {
            params: {
                module: 'account',
                action: 'txlist',
                address,
                ...startBlock && { startblock: startBlock },
                ...endBlock && { endblock: endBlock },
                page,
                offset,
                sort,
                apikey: ETHERSCAN_API_KEY,
            }
        }).then(response => {
            if (response && response.data && Array.isArray(response.data.result)) {
                const transactions: any = Array.from(response.data.result)
                return resolve(transactions.map((transaction: any) => ({
                    blockHash: transaction.blockHash,
                    blockNumber: transaction.blockNumber,
                    hash: transaction.hash,
                    from: transaction.from,
                    to: transaction.to,
                    value: transaction.value,
                    nonce: transaction.nonce,
                    gas: transaction.gas,
                    cumulativeGasUsed: transaction.cumulativeGasUsed,
                    gasUsed: transaction.gasUsed,
                    gasPrice: transaction.gasPrice,
                    timestamp: transaction.timeStamp,
                    status: transaction.txreceipt_status,
                })))
            }
            return reject({
                response: {
                    data: {
                        error: 'Cannot get transactions at the moment'
                    }
                }
            })
        }).catch(reject)
    })
}