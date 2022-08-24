import { RootState } from '../app/store'
import { getAddresses } from './address'
import { getChartDataByAddress } from './portfolio'
import { Transaction as TableTransaction } from '../components/Transactions'
import { Transaction as ModalTransaction } from '../components/TransactionDetailsModal'
import { getAgo } from '../utils'

export function getSelectedAddress (state: RootState) {
    return state.account.selectedAddress
}

export function getSelectedAccount (state: RootState): string {
    const selectedAddress = getSelectedAddress(state)
    if (selectedAddress) {
        const addresses = getAddresses(state)
        const selectedAccount = addresses.find(address => address.address.trim().toLowerCase() === selectedAddress.trim().toLowerCase())
        return selectedAccount ? selectedAccount.alias ? selectedAccount.alias : 'N/A' : 'N/A'
    }
    return 'N/A'
}

export function getSelectedPage (state: RootState) {
    return state.account.selectedPage
}

export function getPeriodType (state: RootState) {
    return state.account.chartData.periodType
}

export function getIsFiat (state: RootState) {
    return state.account.chartData.isFiat
}

export function getChartData (state: RootState) {
    const selectedAddress = getSelectedAddress(state)
    if (selectedAddress) {
        const chartDataByAddress = getChartDataByAddress(state)
        if (chartDataByAddress.hasOwnProperty(selectedAddress)) {
            const periodType = getPeriodType(state)
            const isFiat = getIsFiat(state)
            const chartData = chartDataByAddress[selectedAddress][periodType].data
            return chartData ? isFiat ? chartData.fiat : chartData.eth : null
        }
    }
    return null
}

export function getBalance (state: RootState): number {
    const isFiat = getIsFiat(state)
    if (isFiat) {
        const selectedAddress = getSelectedAddress(state)
        if (selectedAddress) {
            const addresses = getAddresses(state)
            const address = addresses.find(address => address.address === selectedAddress)
            if (address) {
                return address.fiatAmount
            }
        }
        return 0
    }
    const chartData = getChartData(state)
    if (Array.isArray(chartData) && chartData.length > 0) {
        return Number(chartData[chartData.length - 1].y)
    }
    return 0
}

export function getIsChartDataLoading (state: RootState): boolean {
    const selectedAddress = getSelectedAddress(state)
    if (selectedAddress) {
        const chartDataByAddress = getChartDataByAddress(state)
        if (chartDataByAddress.hasOwnProperty(selectedAddress)) {
            const periodType = getPeriodType(state)
            return chartDataByAddress[selectedAddress][periodType].loading
        }
    }
    return false
}

export function getAllTransactions (state: RootState) {
    return state.account.transactions
}

export function getTransactions (state: RootState) {
    const selectedAddress = getSelectedAddress(state)
    const transactions = getAllTransactions(state)
    if (selectedAddress) {
        if (transactions.hasOwnProperty(selectedAddress)) {
            const selectedPage = getSelectedPage(state)
            const start = (selectedPage-1) * 5
            return Array.from(transactions[selectedAddress].data).slice(start, start + 5)
        }
    }
    return []
}

export function getTransactionCount (state: RootState): number {
    const selectedAddress = getSelectedAddress(state)
    const transactions = getAllTransactions(state)
    if (selectedAddress) {
        if (transactions.hasOwnProperty(selectedAddress)) {
            return transactions[selectedAddress].data.length
        }
    }
    return 0
}

export function getTransactionsLoading (state: RootState): boolean {
    const selectedAddress = getSelectedAddress(state)
    const transactions = getAllTransactions(state)
    if (selectedAddress) {
        if (transactions.hasOwnProperty(selectedAddress)) {
            return transactions[selectedAddress].loading
        }
    }
    return false
}

export function getTransactionsFetched (state: RootState): boolean {
    const selectedAddress = getSelectedAddress(state)
    const transactions = getAllTransactions(state)
    if (selectedAddress) {
        if (transactions.hasOwnProperty(selectedAddress)) {
            return transactions[selectedAddress].fetched
        }
    }
    return false
}

type TransactionsData = {
    table: TableTransaction[]
    modal: ModalTransaction[]
}

export function getTransactionsData (state: RootState): TransactionsData {
    const selectedAddress = getSelectedAddress(state)
    const selectedAccount = getSelectedAccount(state)
    const transactions = getTransactions(state)
    return transactions.reduce((transactions: TransactionsData, transaction) => {
        const withdrawal = selectedAddress ? selectedAddress.trim().toLowerCase() === transaction.from : false
        return {
            table: [
                ...transactions.table,
                {
                    withdrawal,
                    hash: transaction.hash,
                    from: transaction.from,
                    to: transaction.to,
                    date: getAgo(transaction.timestamp),
                    value: transaction.value,
                    amount: transaction.amount
                }
            ],
            modal: [
                ...transactions.modal,
                {
                    withdrawal,
                    ethAmount: transaction.amount,
                    fiatAmount: transaction.value,
                    account: selectedAccount,
                    timestamp: transaction.timestamp,
                    fee: transaction.fee,
                    status: transaction.status,
                    blockNumber: transaction.blockNumber,
                    transactionHash: transaction.hash,
                    from: transaction.from,
                    to: transaction.to,
                }
            ]
        }
    }, { table: [], modal: [] })
}