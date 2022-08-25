import { createAction, createSlice } from '@reduxjs/toolkit'

export type PortfolioPoints = Array<{ x: string, y: string }>

export type ChartData = {
    eth: PortfolioPoints
    fiat: PortfolioPoints
} | null

export type ChartDataByAddress = {
    [address: string]: {
        weekly: {
            loading: boolean
            data: ChartData
        },
        monthly: {
            loading: boolean
            data: ChartData
        },
        yearly: {
            loading: boolean
            data: ChartData
        }
    }
}

export type PeriodType = 'weekly' | 'monthly' | 'yearly'

export type PortfolioDataByAddress = {
    [address: string]: {
        periodType: PeriodType
        isFiat: boolean
    }
}

export interface Transaction {
    hash: string
    from: string
    to: string
    timestamp: string
    value: string
    amount: string
    blockNumber: string
    status: string
    fee: string
}

interface LatestTransactions {
    data: Transaction[]
    loading: boolean
    fetched: boolean
}

interface PortfolioState {
    chartDataByAddress: ChartDataByAddress
    portfolioDataByAddress: PortfolioDataByAddress
    latestTransactions: LatestTransactions
    selectedPortfolioAddress: string | null
    errorMessage: string | null
}

const initialState: PortfolioState = {
    chartDataByAddress: {},
    portfolioDataByAddress: {},
    latestTransactions: {
        data: [],
        loading: false,
        fetched: false,
    },
    selectedPortfolioAddress: null,
    errorMessage: null,
}

const portfolioActions = {
    setSelectedPortfolioAddress: createAction<{ address: string }>('portfolio/setSelectedPortfolioAddress'),
    setPeriodType: createAction<{ address: string, periodType: PeriodType }>('portfolio/setPeriodType'),
    setIsFiat: createAction<{ address: string, isFiat: boolean }>('portfolio/setIsFiat'),
    fetchWeekly: createAction<{ address: string }>('portfolio/fetchWeekly'),
    fetchWeeklyFulfilled: createAction<{
        address: string,
        data: { eth: PortfolioPoints, fiat: PortfolioPoints }
    }>('portfolio/fetchWeeklyFulfilled'),
    fetchMonthly: createAction<{ address: string }>('portfolio/fetchMonthly'),
    fetchMonthlyFulfilled: createAction<{
        address: string,
        data: { eth: PortfolioPoints, fiat: PortfolioPoints }
    }>('portfolio/fetchMonthlyFulfilled'),
    fetchYearly: createAction<{ address: string }>('portfolio/fetchYearly'),
    fetchYearlyFulfilled: createAction<{
        address: string,
        data: { eth: PortfolioPoints, fiat: PortfolioPoints }
    }>('portfolio/fetchYearlyFulfilled'),
    fetchRejected: createAction<{ address: string, errorMessage: string }>('portfolio/fetchRejected'),
    fetchLatestTransactions: createAction<{ addresses: string[] }>('portfolio/fetchLatestTransactions'),
    fetchLatestTransactionsFulfilled: createAction<{ transactions: Transaction[] }>('portfolio/fetchLatestTransactionsFulfilled'),
    fetchLatestTransactionsRejected: createAction('portfolio/fetchLatestTransactionsRejected'),
}

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(portfolioActions.setSelectedPortfolioAddress, (state, action) => {
                state.selectedPortfolioAddress = action.payload.address
            })
            .addCase(portfolioActions.setPeriodType, (state, action) => {
                const address = action.payload.address
                const periodType = action.payload.periodType
                if (state.portfolioDataByAddress.hasOwnProperty(address)) {
                    state.portfolioDataByAddress[address] = {
                        ...state.portfolioDataByAddress[address],
                        periodType,
                    }
                } else {
                    state.portfolioDataByAddress = {
                        ...state.portfolioDataByAddress,
                        [address]: {
                            periodType,
                            isFiat: true,
                        }
                    }
                }
            })
            .addCase(portfolioActions.setIsFiat, (state, action) => {
                const address = action.payload.address
                const isFiat = action.payload.isFiat
                if (state.portfolioDataByAddress.hasOwnProperty(address)) {
                    state.portfolioDataByAddress[address] = {
                        ...state.portfolioDataByAddress[address],
                        isFiat,
                    }
                } else {
                    state.portfolioDataByAddress = {
                        ...state.portfolioDataByAddress,
                        [address]: {
                            periodType: 'weekly',
                            isFiat,
                        }
                    }
                }
            })
            .addCase(portfolioActions.fetchWeekly, (state, action) => {
                const address = action.payload.address
                if (state.chartDataByAddress.hasOwnProperty(address)) {
                    state.chartDataByAddress[address].weekly = {
                        ...state.chartDataByAddress[address].weekly,
                        loading: true,
                    }
                } else {
                    state.chartDataByAddress = {
                        ...state.chartDataByAddress,
                        [address]: {
                            weekly: {
                                loading: true,
                                data: null,
                            },
                            monthly: {
                                loading: false,
                                data: null,
                            },
                            yearly: {
                                loading: false,
                                data: null,
                            }
                        }
                    }
                }
            })
            .addCase(portfolioActions.fetchWeeklyFulfilled, (state, action) => {
                const { address, data } = action.payload
                state.chartDataByAddress[address].weekly = {
                    ...state.chartDataByAddress[address].weekly,
                    loading: false,
                    data,
                }
            })
            .addCase(portfolioActions.fetchMonthly, (state, action) => {
                const address = action.payload.address
                if (state.chartDataByAddress.hasOwnProperty(address)) {
                    state.chartDataByAddress[address].monthly = {
                        ...state.chartDataByAddress[address].monthly,
                        loading: true,
                    }
                } else {
                    state.chartDataByAddress = {
                        ...state.chartDataByAddress,
                        [address]: {
                            weekly: {
                                loading: false,
                                data: null,
                            },
                            monthly: {
                                loading: true,
                                data: null,
                            },
                            yearly: {
                                loading: false,
                                data: null,
                            }
                        }
                    }
                }
            })
            .addCase(portfolioActions.fetchMonthlyFulfilled, (state, action) => {
                const { address, data } = action.payload
                state.chartDataByAddress[address].monthly = {
                    ...state.chartDataByAddress[address].monthly,
                    loading: false,
                    data,
                }
            })
            .addCase(portfolioActions.fetchYearly, (state, action) => {
                const address = action.payload.address
                if (state.chartDataByAddress.hasOwnProperty(address)) {
                    state.chartDataByAddress[address].yearly = {
                        ...state.chartDataByAddress[address].yearly,
                        loading: true,
                    }
                } else {
                    state.chartDataByAddress = {
                        ...state.chartDataByAddress,
                        [address]: {
                            weekly: {
                                loading: false,
                                data: null,
                            },
                            monthly: {
                                loading: false,
                                data: null,
                            },
                            yearly: {
                                loading: true,
                                data: null,
                            }
                        }
                    }
                }
            })
            .addCase(portfolioActions.fetchYearlyFulfilled, (state, action) => {
                const { address, data } = action.payload
                state.chartDataByAddress[address].yearly = {
                    ...state.chartDataByAddress[address].yearly,
                    loading: false,
                    data,
                }
            })
            .addCase(portfolioActions.fetchRejected, (state, action) => {
                const address = action.payload.address
                state.chartDataByAddress[address].weekly = {
                    ...state.chartDataByAddress[address].weekly,
                    loading: false,
                }
                state.chartDataByAddress[address].monthly = {
                    ...state.chartDataByAddress[address].monthly,
                    loading: false,
                }
                state.chartDataByAddress[address].yearly = {
                    ...state.chartDataByAddress[address].yearly,
                    loading: false,
                }
                state.errorMessage = action.payload.errorMessage
            })
            .addCase(portfolioActions.fetchLatestTransactions, state => {
                state.latestTransactions = {
                    ...state.latestTransactions,
                    loading: true,
                }
            })
            .addCase(portfolioActions.fetchLatestTransactionsFulfilled, (state, action) => {
                const transactions = action.payload.transactions
                state.latestTransactions = {
                    data: transactions,
                    loading: false,
                    fetched: true,
                }
            })
            .addCase(portfolioActions.fetchLatestTransactionsRejected, (state) => {
                state.latestTransactions = {
                    data: [],
                    loading: false,
                    fetched: false,
                }
            })
})

export { portfolioActions }

export default portfolioSlice.reducer