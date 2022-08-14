import { createAction, createSlice } from '@reduxjs/toolkit'
import { PeriodType } from './portfolio'


interface Transaction {
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

interface AccountState {
    selectedAddress: string | null
    selectedPage: number
    chartData: {
        periodType: PeriodType
        isFiat: boolean
    }
    transactions: {
        [address: string]: {
            count: number
            [page: number]: {
                data: Transaction[]
                loading: boolean
                fetched: boolean
            }
        }
    }
}

const initialState: AccountState = {
    selectedAddress: null,
    selectedPage: 1,
    chartData: {
        periodType: 'weekly',
        isFiat: true
    },
    transactions: {},
}

const accountActions = {
    setSelectedAddress: createAction<{ address: string }>('account/setSelectedAddress'),
    setSelectedPage: createAction<{ page: number }>('account/setSelectedPage'),
    setPeriodType: createAction<{ periodType: PeriodType }>('account/setPeriodType'),
    setIsFiat: createAction<{ isFiat: boolean }>('account/setIsFiat'),
    fetchTransactions: createAction<{ address: string, page: number }>('account/fetchTransactions'),
    fetchTransactionsFulfilled: createAction<{ address: string, page: number, data: Transaction[], count?: number }>('account/fetchTransactionsFulfilled'),
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(accountActions.setSelectedAddress, (state, action) => {
                state.selectedAddress = action.payload.address
            })
            .addCase(accountActions.setSelectedPage, (state, action) => {
                state.selectedPage = action.payload.page
            })
            .addCase(accountActions.setPeriodType, (state, action) => {
                state.chartData.periodType = action.payload.periodType
            })
            .addCase(accountActions.setIsFiat, (state, action) => {
                state.chartData.isFiat = action.payload.isFiat
            })
            .addCase(accountActions.fetchTransactions, (state, action) => {
                const { address, page } = action.payload
                if (page <= 1) {
                    state.transactions[address] = {
                        count: 0,
                    }
                }
                state.transactions[address][page] = {
                    data: [],
                    loading: true,
                    fetched: false,
                }
            })
            .addCase(accountActions.fetchTransactionsFulfilled, (state, action) => {
                const { address, page, data, count } = action.payload
                state.transactions[address] = {
                    ...state.transactions[address],
                    count: page > 1 ? state.transactions[address].count : count ? count : 0,
                    [page]: {
                        data,
                        loading: false,
                        fetched: true,
                    }
                }
            })
})

export { accountActions }

export default accountSlice.reducer