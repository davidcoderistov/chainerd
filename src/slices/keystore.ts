import { createAction, createSlice } from '@reduxjs/toolkit'
import { VaultOptions } from 'eth-lightwallet'

interface KeystoreState {
    keystore: string | null,
    loading: boolean,
    statusCode: number | null,
    errorMessage: string | null,
    successMessage: string | null,
}

const initialState: KeystoreState = {
    keystore: null,
    loading: false,
    statusCode: null,
    errorMessage: null,
    successMessage: null,
}

const keystoreActions = {
    generate: createAction<VaultOptions>('keystore/generate'),
    restore: createAction<VaultOptions>('keystore/restore'),
    load: createAction<{ keystore: string }>('keystore/load'),
    set: createAction<{ keystore: string }>('keystore/set'),
    destroy: createAction('keystore/destroy'),
    pending: createAction('keystore/pending'),
    fulfilled: createAction<{ keystore: string | null, statusCode: number, successMessage: string }>('keystore/fulfilled'),
    rejected: createAction<{ errorMessage: string, statusCode: number }>('keystore/rejected'),
}

const keystoreSlice = createSlice({
    name: 'keystore',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(keystoreActions.set, (state, action) => ({
                ...state,
                keystore: action.payload.keystore,
            }))
            .addCase(keystoreActions.pending, state => {
                return {
                    ...state,
                    loading: true,
                    statusCode: null,
                }
            })
            .addCase(keystoreActions.fulfilled, (state, action) => {
                return {
                    ...state,
                    keystore: action.payload.keystore,
                    statusCode: action.payload.statusCode,
                    successMessage: action.payload.successMessage,
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
                    successMessage: null,
                }
            })
})

export { keystoreActions }

export default keystoreSlice.reducer