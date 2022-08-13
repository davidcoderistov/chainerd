import { createAction, createSlice } from '@reduxjs/toolkit'
import { PeriodType } from './portfolio'


interface AccountState {
    selectedAddress: string | null
    chartData: {
        periodType: PeriodType
        isFiat: boolean
    }
}

const initialState: AccountState = {
    selectedAddress: null,
    chartData: {
        periodType: 'weekly',
        isFiat: true
    }
}

const accountActions = {
    setSelectedAddress: createAction<{ address: string }>('account/setSelectedAddress'),
    setPeriodType: createAction<{ periodType: PeriodType }>('account/setPeriodType'),
    setIsFiat: createAction<{ isFiat: boolean }>('account/setIsFiat'),
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
            .addCase(accountActions.setPeriodType, (state, action) => {
                state.chartData.periodType = action.payload.periodType
            })
            .addCase(accountActions.setIsFiat, (state, action) => {
                state.chartData.isFiat = action.payload.isFiat
            })
})

export { accountActions }

export default accountSlice.reducer