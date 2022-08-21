import { RootState } from '../app/store'
import { getAddresses } from './address'
import { PeriodType, PortfolioPoints } from '../slices/portfolio'
import { AddressType } from '../slices/address'
import { Transaction as TableTransaction } from '../components/Transactions'
import { Transaction as ModalTransaction } from '../components/TransactionDetailsModal'

export function getChartDataByAddress (state: RootState) {
    return state.portfolio.chartDataByAddress
}

export function getPortfolioDataByAddress (state: RootState) {
    return state.portfolio.portfolioDataByAddress
}

export function getSelectedPortfolioAddress (state: RootState) {
    return state.portfolio.selectedPortfolioAddress
}

export function getPeriodType (state: RootState): PeriodType {
    const selectedAddress = getSelectedPortfolioAddress(state)
    if (selectedAddress) {
        const portfolioDataByAddress = getPortfolioDataByAddress(state)
        if (portfolioDataByAddress.hasOwnProperty(selectedAddress)) {
            return portfolioDataByAddress[selectedAddress].periodType
        }
    }
    return 'weekly'
}

export function getIsFiat (state: RootState): boolean {
    const selectedAddress = getSelectedPortfolioAddress(state)
    if (selectedAddress) {
        const portfolioDataByAddress = getPortfolioDataByAddress(state)
        if (portfolioDataByAddress.hasOwnProperty(selectedAddress)) {
            return portfolioDataByAddress[selectedAddress].isFiat
        }
    }
    return true
}

export function getChartDataByPortfolioAddress (state: RootState): PortfolioPoints | null {
    const selectedAddress = getSelectedPortfolioAddress(state)
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

export function getBalanceByPortfolioAddress (state: RootState): number {
    const chartData = getChartDataByPortfolioAddress(state)
    if (Array.isArray(chartData) && chartData.length > 0) {
        return Number(chartData[chartData.length - 1].y)
    }
    return 0
}

export function getIsChartDataLoadingByPortfolioAddress (state: RootState): boolean {
    const selectedAddress = getSelectedPortfolioAddress(state)
    if (selectedAddress) {
        const chartDataByAddress = getChartDataByAddress(state)
        if (chartDataByAddress.hasOwnProperty(selectedAddress)) {
            const periodType = getPeriodType(state)
            return chartDataByAddress[selectedAddress][periodType].loading
        }
    }
    return false
}

export function getLatestTransactions (state: RootState) {
    return state.portfolio.latestTransactions.data
}

export function getLatestTransactionsLoading (state: RootState) {
    return state.portfolio.latestTransactions.loading
}

export function getLatestTransactionsFetched (state: RootState) {
    return state.portfolio.latestTransactions.fetched
}

type TransactionsData = {
    table: TableTransaction[]
    modal: ModalTransaction[]
}

export function getLatestTransactionsData (state: RootState) {
    const transactions = getLatestTransactions(state)
    const addresses = getAddresses(state)
    const addressesMapping: {
        [address: string]: AddressType
    } = addresses.reduce((mapping, address) => ({
        ...mapping,
        [address.address.trim().toLowerCase()]: address
    }), {})
    return transactions.reduce((transactions: TransactionsData, transaction) => {
        const from = transaction.from
        const to = transaction.to
        const hasFrom = addressesMapping.hasOwnProperty(from)
        const hasTo = addressesMapping.hasOwnProperty(to)
        const withdrawal = hasFrom ? true : hasTo ? false : false
        const selectedAddress = hasFrom ? addressesMapping[from] : hasTo ? addressesMapping[to] : null
        const selectedAccount = selectedAddress ? selectedAddress.alias ? selectedAddress.alias : 'N/A' : 'N/A'
        return {
            table: [
                ...transactions.table,
                {
                    withdrawal,
                    hash: transaction.hash,
                    from,
                    to,
                    date: transaction.timestamp,
                    value: transaction.value,
                    amount: transaction.amount
                }
            ],
            modal: [
                ...transactions.modal,
                {
                    withdrawal,
                    ethAmount: transaction.value,
                    fiatAmount: transaction.amount,
                    account: selectedAccount,
                    timestamp: transaction.timestamp,
                    fee: transaction.fee,
                    status: transaction.status,
                    blockNumber: transaction.blockNumber,
                    transactionHash: transaction.hash,
                    from,
                    to,
                }
            ]
        }
    }, { table: [], modal: [] })
}