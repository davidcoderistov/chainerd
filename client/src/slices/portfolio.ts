import { createAction, createSlice } from '@reduxjs/toolkit'

export type PortfolioPoints = Array<{ x: string, y: string }>

interface PortfolioState {
    dataByAddress: {
        [address: string]: {
            weekly: {
                loading: boolean
                data: {
                    eth: PortfolioPoints
                    fiat: PortfolioPoints
                } | null
            },
            monthly: {
                loading: boolean
                data: {
                    eth: PortfolioPoints
                    fiat: PortfolioPoints
                } | null
            },
            yearly: {
                loading: boolean
                data: {
                    eth: PortfolioPoints
                    fiat: PortfolioPoints
                } | null
            }
        },
    },
    errorMessage: string | null
}

const initialState: PortfolioState = {
    dataByAddress: {},
    errorMessage: null,
}

const portfolioActions = {
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
}

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(portfolioActions.fetchWeekly, (state, action) => {
                const address = action.payload.address
                if (state.dataByAddress.hasOwnProperty(address)) {
                    state.dataByAddress[address].weekly = {
                        ...state.dataByAddress[address].weekly,
                        loading: true,
                    }
                } else {
                    state.dataByAddress = {
                        ...state.dataByAddress,
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
                state.dataByAddress[address].weekly = {
                    ...state.dataByAddress[address].weekly,
                    loading: false,
                    data,
                }
            })
            .addCase(portfolioActions.fetchMonthly, (state, action) => {
                const address = action.payload.address
                if (state.dataByAddress.hasOwnProperty(address)) {
                    state.dataByAddress[address].monthly = {
                        ...state.dataByAddress[address].monthly,
                        loading: true,
                    }
                } else {
                    state.dataByAddress = {
                        ...state.dataByAddress,
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
                state.dataByAddress[address].monthly = {
                    ...state.dataByAddress[address].monthly,
                    loading: false,
                    data,
                }
            })
            .addCase(portfolioActions.fetchYearly, (state, action) => {
                const address = action.payload.address
                if (state.dataByAddress.hasOwnProperty(address)) {
                    state.dataByAddress[address].yearly = {
                        ...state.dataByAddress[address].yearly,
                        loading: true,
                    }
                } else {
                    state.dataByAddress = {
                        ...state.dataByAddress,
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
                state.dataByAddress[address].yearly = {
                    ...state.dataByAddress[address].yearly,
                    loading: false,
                    data,
                }
            })
            .addCase(portfolioActions.fetchRejected, (state, action) => {
                const address = action.payload.address
                state.dataByAddress[address].weekly = {
                    ...state.dataByAddress[address].weekly,
                    loading: false,
                }
                state.dataByAddress[address].monthly = {
                    ...state.dataByAddress[address].monthly,
                    loading: false,
                }
                state.dataByAddress[address].yearly = {
                    ...state.dataByAddress[address].yearly,
                    loading: false,
                }
                state.errorMessage = action.payload.errorMessage
            })
})

export { portfolioActions }

export default portfolioSlice.reducer