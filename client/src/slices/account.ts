import { createAction, createSlice } from '@reduxjs/toolkit'
import { PeriodType } from './portfolio'


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

interface AccountState {
    selectedAddress: string | null
    selectedPage: number
    chartData: {
        periodType: PeriodType
        isFiat: boolean
    }
    transactions: {
        [address: string]: {
            data: Transaction[]
            loading: boolean
            fetched: boolean
        }
    }
}

const initialState: AccountState = {
    selectedAddress: null,
    selectedPage: 1,
    chartData: {
        periodType: 'yearly',
        isFiat: true
    },
    transactions: {},
}

const accountActions = {
    setSelectedAddress: createAction<{ address: string }>('account/setSelectedAddress'),
    setSelectedPage: createAction<{ page: number }>('account/setSelectedPage'),
    setPeriodType: createAction<{ periodType: PeriodType }>('account/setPeriodType'),
    setIsFiat: createAction<{ isFiat: boolean }>('account/setIsFiat'),
    fetchTransactions: createAction<{ address: string }>('account/fetchTransactions'),
    fetchTransactionsFulfilled: createAction<{ address: string, data: Transaction[] }>('account/fetchTransactionsFulfilled'),
    clearAll: createAction('account/clearAll')
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
                const { address } = action.payload
                state.transactions[address] = {
                    data: [],
                    loading: true,
                    fetched: false,
                }
            })
            .addCase(accountActions.fetchTransactionsFulfilled, (state, action) => {
                const { address, data } = action.payload
                state.transactions[address] = {
                    data,
                    loading: false,
                    fetched: true,
                }
            })
            .addCase(accountActions.clearAll, () => ({
                ...initialState
            }))
})

export { accountActions }

export default accountSlice.reducer