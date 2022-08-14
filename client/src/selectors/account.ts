import { RootState } from '../app/store'
import { getChartDataByAddress } from './portfolio'

export function getSelectedAddress (state: RootState) {
    return state.account.selectedAddress
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

export function getTransactionCount (state: RootState): number {
    const selectedAddress = getSelectedAddress(state)
    const transactions = getAllTransactions(state)
    if (selectedAddress) {
        if (transactions.hasOwnProperty(selectedAddress)) {
            return transactions[selectedAddress].count
        }
        return 0
    }
    return 0
}

export function getTransactions (state: RootState) {
    const selectedAddress = getSelectedAddress(state)
    const transactions = getAllTransactions(state)
    if (selectedAddress) {
        if (transactions.hasOwnProperty(selectedAddress)) {
            const selectedPage = getSelectedPage(state)
            if (transactions[selectedAddress].hasOwnProperty(selectedPage)) {
                return transactions[selectedAddress][selectedPage].data
            }
            return []
        }
        return []
    }
    return []
}

export function getTransactionsLoading (state: RootState): boolean {
    const selectedAddress = getSelectedAddress(state)
    const transactions = getAllTransactions(state)
    if (selectedAddress) {
        if (transactions.hasOwnProperty(selectedAddress)) {
            const selectedPage = getSelectedPage(state)
            if (transactions[selectedAddress].hasOwnProperty(selectedPage)) {
                return transactions[selectedAddress][selectedPage].loading
            }
            return false
        }
        return false
    }
    return false
}

export function getTransactionsFetched (state: RootState): boolean {
    const selectedAddress = getSelectedAddress(state)
    const transactions = getAllTransactions(state)
    if (selectedAddress) {
        if (transactions.hasOwnProperty(selectedAddress)) {
            const selectedPage = getSelectedPage(state)
            if (transactions[selectedAddress].hasOwnProperty(selectedPage)) {
                return transactions[selectedAddress][selectedPage].fetched
            }
            return false
        }
        return false
    }
    return false
}