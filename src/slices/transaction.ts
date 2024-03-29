import { createAction, createSlice } from '@reduxjs/toolkit'

interface TransactionState {
    request: {
        loading: boolean
        statusCode: number | null
        errorMessage: string | null
        successMessage: string | null
    }
    activeStep: number
    fromAddress: string
    toAddress: string
    ethAmount: string
    fiatAmount: string
    ethPrice: number
    gasInfo: {
        lowGasPrice: number
        highGasPrice: number
        gasPrice: number
    }
    hash: string | null
}

const initialState: TransactionState = {
    request: {
        loading: false,
        statusCode: null,
        errorMessage: null,
        successMessage: null,
    },
    activeStep: 0,
    fromAddress: '',
    toAddress: '',
    ethAmount: '',
    fiatAmount: '',
    ethPrice: 0,
    gasInfo: {
        lowGasPrice: 0,
        highGasPrice: 100,
        gasPrice: 50,
    },
    hash: null
}

const transactionActions = {
    setActiveStep: createAction<{ step: number }>('transaction/setActiveStep'),
    setFromAddress: createAction<{ address: string }>('transaction/setFromAddress'),
    setToAddress: createAction<{ address: string }>('transaction/setToAddress'),
    setEthAmount: createAction<{ ethAmount: string }>('transaction/setEthAmount'),
    setFiatAmount: createAction<{ fiatAmount: string }>('transaction/setFiatAmount'),
    setGasInfo: createAction('transaction/setGasInfo'),
    setGasPrice: createAction<{ gasPrice: number }>('transaction/setGasPrice'),
    setHash: createAction<{ hash: string | null }>('transaction/setHash'),
    clearAll: createAction('transaction/clearAll'),
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
    sendTransaction: createAction<{ fromAddress: string, toAddress: string, password: string }>('transaction/sendTransaction'),
    fulfilled: createAction<{ statusCode: number, successMessage: string }>('transaction/fulfilled'),
    rejected: createAction<{ statusCode: number, errorMessage: string }>('transaction/rejected'),
    pending: createAction('transaction/pending')
}

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(transactionActions.setActiveStep, (state, action) => ({
                ...state,
                activeStep: action.payload.step,
            }))
            .addCase(transactionActions.setFromAddress, (state, action) => {
                state.fromAddress = action.payload.address
            })
            .addCase(transactionActions.setToAddress, (state, action) => {
                state.toAddress = action.payload.address
            })
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
            .addCase(transactionActions.setHash, (state, action) => ({
                ...state,
                hash: action.payload.hash,
            }))
            .addCase(transactionActions.clearAll, () => ({
                ...initialState,
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
            .addCase(transactionActions.fulfilled, (state, action) => ({
                ...state,
                request: {
                    loading: false,
                    statusCode: action.payload.statusCode,
                    successMessage: action.payload.successMessage,
                    errorMessage: null,
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