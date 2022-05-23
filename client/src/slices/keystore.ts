import { createAction, createSlice } from '@reduxjs/toolkit'
import { VaultOptions } from 'eth-lightwallet'


// Initial state
interface KeystoreState {
    keystore: string | null,
    password: string | null,
    loading: boolean,
    error: any,
}

const initialState: KeystoreState = {
    keystore: null,
    password: null,
    loading: false,
    error: null
}

// Actions
const createWallet = {
    generate: createAction<VaultOptions>('createWallet/start'),
    pending: createAction('createWallet/pending'),
    fulfilled: createAction<{ keystore: string, password: string }>('createWallet/fulfilled'),
    rejected: createAction<{ error: any }>('createWallet/rejected')
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
                }
            })
            .addCase(createWallet.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    keystore: action.payload.keystore,
                    password: action.payload.password,
                }
            })
            .addCase(createWallet.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.payload.error,
                    keystore: null,
                }
            })
})

export { createWallet }

export default keystoreSlice.reducer