import { createAction, createSlice } from '@reduxjs/toolkit'

interface TransactionState {
    request: {
        loading: boolean
        statusCode: number | null
        errorMessage: string | null
        successMessage: string | null
    }
    ethAmount: string
    fiatAmount: string
}

const initialState: TransactionState = {
    request: {
        loading: false,
        statusCode: null,
        errorMessage: null,
        successMessage: null,
    },
    ethAmount: '',
    fiatAmount: '',
}

const transactionActions = {
    setEthAmount: createAction<{ ethAmount: string }>('transaction/setEthAmount'),
    setFiatAmount: createAction<{ fiatAmount: string }>('transaction/setFiatAmount'),
    setAmountFulfilled: createAction<{
        statusCode: number,
        successMessage: string,
        ethAmount: string,
        fiatAmount: string,
    }>('transaction/setAmountResolved'),
    setAmountRejected: createAction<{ statusCode: number, errorMessage: string }>('transaction/setAmountRejected'),
    pending: createAction('transaction/pending')
}

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(transactionActions.setEthAmount, (state, action) => ({
                ...state,
                request: {
                    ...state.request,
                    loading: true,
                },
                ethAmount: action.payload.ethAmount,
            }))
            .addCase(transactionActions.setFiatAmount, (state, action) => ({
                ...state,
                request: {
                    ...state.request,
                    loading: true,
                },
                fiatAmount: action.payload.fiatAmount,
            }))
            .addCase(transactionActions.pending, state => ({
                ...state,
                request: {
                    loading: true,
                    statusCode: null,
                    errorMessage: null,
                    successMessage: null,
                }
            }))
            .addCase(transactionActions.setAmountFulfilled, (state, action) => ({
                request: {
                    loading: false,
                    statusCode: action.payload.statusCode,
                    errorMessage: null,
                    successMessage: action.payload.successMessage,
                },
                ethAmount: action.payload.ethAmount,
                fiatAmount: action.payload.fiatAmount,
            }))
            .addCase(transactionActions.setAmountRejected, (state, action) => ({
                ...state,
                request: {
                    loading: false,
                    statusCode: action.payload.statusCode,
                    errorMessage: action.payload.errorMessage,
                    successMessage: null,
                }
            }))
})

export { transactionActions }

export default transactionSlice.reducer