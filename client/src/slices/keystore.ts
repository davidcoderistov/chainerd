import { createAction, createSlice } from '@reduxjs/toolkit'
import { VaultOptions } from 'eth-lightwallet'


// Initial state
interface KeystoreState {
    keystore: string | null,
    loading: boolean,
    error: string | null,
    errorCode: number | null
}

const initialState: KeystoreState = {
    keystore: null,
    loading: false,
    error: null,
    errorCode: null
}

// Actions
const keystoreActions = {
    generate: createAction<VaultOptions>('keystore/generate'),
    restore: createAction<VaultOptions>('keystore/restore'),
    load: createAction<{ keystore: string }>('keystore/load'),
    destroy: createAction('keystore/destroy'),
    generateAddress: createAction<{ password: string }>('keystore/generateAddress'),
    clearError: createAction('keystore/clearErrors'),
    pending: createAction('keystore/pending'),
    fulfilled: createAction<{ keystore: string | null}>('keystore/fulfilled'),
    rejected: createAction<{ error: { message: string, errorCode: number } }>('keystore/rejected')
}

const keystoreSlice = createSlice({
    name: 'keystore',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(keystoreActions.pending, state => {
                return {
                    ...state,
                    loading: true,
                    error: null,
                    errorCode: null,
                }
            })
            .addCase(keystoreActions.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    keystore: action.payload.keystore,
                    errorCode: null,
                }
            })
            .addCase(keystoreActions.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.payload.error.message,
                    errorCode: action.payload.error.errorCode,
                }
            })
            .addCase(keystoreActions.clearError, (state) => {
                return {
                    ...state,
                    error: null,
                    errorCode: null,
                }
            })
})

export { keystoreActions }

export default keystoreSlice.reducer