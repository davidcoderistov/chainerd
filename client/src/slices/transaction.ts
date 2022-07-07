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
    ethPrice: number
    gasInfo: {
        lowGasPrice: number
        highGasPrice: number
        gasPrice: number
    }
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
    ethPrice: 0,
    gasInfo: {
        lowGasPrice: 0,
        highGasPrice: 100,
        gasPrice: 50,
    }
}

const transactionActions = {
    setEthAmount: createAction<{ ethAmount: string }>('transaction/setEthAmount'),
    setFiatAmount: createAction<{ fiatAmount: string }>('transaction/setFiatAmount'),
    setGasInfo: createAction('transaction/setGasInfo'),
    setGasPrice: createAction<{ gasPrice: number }>('transaction/setGasPrice'),
    setAmountFulfilled: createAction<{
        statusCode: number,
        successMessage: string,
        ethAmount: string,
        fiatAmount: string,
        ethPrice: number,
    }>('transaction/setAmountResolved'),
    setGasInfoFulfilled: createAction<{
        lowGasPrice: number,
        highGasPrice: number,
        gasPrice: number,
        statusCode: number,
        successMessage: string,
    }>('transaction/setGasInfoFulfilled'),
    rejected: createAction<{ statusCode: number, errorMessage: string }>('transaction/rejected'),
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
            .addCase(transactionActions.setGasPrice, (state, action) => {
                return ({
                    ...state,
                    gasInfo: {
                        ...state.gasInfo,
                        gasPrice: action.payload.gasPrice,
                    }
                })
            })
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
                ...state,
                request: {
                    loading: false,
                    statusCode: action.payload.statusCode,
                    errorMessage: null,
                    successMessage: action.payload.successMessage,
                },
                ethAmount: action.payload.ethAmount,
                fiatAmount: action.payload.fiatAmount,
                ethPrice: action.payload.ethPrice,
            }))
            .addCase(transactionActions.setGasInfoFulfilled, (state, action) => ({
                ...state,
                request: {
                    loading: false,
                    statusCode: action.payload.statusCode,
                    errorMessage: null,
                    successMessage: action.payload.successMessage,
                },
                gasInfo: {
                    lowGasPrice: action.payload.lowGasPrice,
                    highGasPrice: action.payload.highGasPrice,
                    gasPrice: action.payload.gasPrice,
                }
            }))
            .addCase(transactionActions.rejected, (state, action) => ({
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