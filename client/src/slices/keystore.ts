import { createAction, createSlice } from '@reduxjs/toolkit'
import { VaultOptions } from 'eth-lightwallet'


// Initial state
interface KeystoreState {
    keystore: string | null,
    password: string | null,
    loading: boolean,
    error: string | null,
    errorCode: number | null
}

const initialState: KeystoreState = {
    keystore: null,
    password: null,
    loading: false,
    error: null,
    errorCode: null
}

// Actions
const createWallet = {
    generate: createAction<VaultOptions>('createWallet/start'),
    restore: createAction<VaultOptions>('createWallet/restore'),
    pending: createAction('createWallet/pending'),
    fulfilled: createAction<{ keystore: string, password: string }>('createWallet/fulfilled'),
    rejected: createAction<{ error: { message: string, errorCode: number } }>('createWallet/rejected')
}

const keystoreSlice = createSlice({
    name: 'keystore',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(createWallet.pending, state => {
                return {
                    ...state,
                    loading: true,
                    error: null,
                    errorCode: null,
                }
            })
            .addCase(createWallet.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    keystore: action.payload.keystore,
                    password: action.payload.password,
                    errorCode: null,
                }
            })
            .addCase(createWallet.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.payload.error.message,
                    errorCode: action.payload.error.errorCode,
                    keystore: null,
                }
            })
})

export { createWallet }

export default keystoreSlice.reducer