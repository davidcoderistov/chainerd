import { createAction, createSlice } from '@reduxjs/toolkit'
import { VaultOptions } from 'eth-lightwallet'


// Initial state
interface KeystoreState {
    keystore: string | null,
    loading: boolean,
    statusCode: number | null,
    errorMessage: string | null,
}

const initialState: KeystoreState = {
    keystore: null,
    loading: false,
    statusCode: null,
    errorMessage: null,
}

// Actions
const keystoreActions = {
    generate: createAction<VaultOptions>('keystore/generate'),
    restore: createAction<VaultOptions>('keystore/restore'),
    load: createAction<{ keystore: string }>('keystore/load'),
    destroy: createAction('keystore/destroy'),
    generateAddress: createAction<{ password: string }>('keystore/generateAddress'),
    pending: createAction('keystore/pending'),
    fulfilled: createAction<{ keystore: string | null, statusCode: number }>('keystore/fulfilled'),
    rejected: createAction<{ errorMessage: string, statusCode: number }>('keystore/rejected')
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
                    statusCode: null,
                    errorMessage: null,
                }
            })
            .addCase(keystoreActions.fulfilled, (state, action) => {
                return {
                    ...state,
                    keystore: action.payload.keystore,
                    statusCode: action.payload.statusCode,
                    loading: false,
                    errorMessage: null,
                }
            })
            .addCase(keystoreActions.rejected, (state, action) => {
                return {
                    ...state,
                    statusCode: action.payload.statusCode,
                    errorMessage: action.payload.errorMessage,
                    loading: false,
                }
            })
})

export { keystoreActions }

export default keystoreSlice.reducer