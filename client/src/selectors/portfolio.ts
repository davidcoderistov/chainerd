import { RootState } from '../app/store'
import { PeriodType, PortfolioPoints } from '../slices/portfolio'

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