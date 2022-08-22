import { createAction, createSlice } from '@reduxjs/toolkit'

export interface AddressType {
    address: string
    alias: string | null
    ethAmount: number
    fiatAmount: number
    percentage: number
    loading: boolean
}

interface AddressState {
    addresses: Array<AddressType>
    addressesLoading: boolean
    loading: boolean
    statusCode: number | null
    successMessage: string | null
    errorMessage: string | null
}

const initialState: AddressState = {
    addresses: [],
    addressesLoading: false,
    loading: false,
    statusCode: null,
    successMessage: null,
    errorMessage: null,
}

const addressActions = {
    loadAll: createAction<{ keystore: string }>('address/loadAll'),
    loadAllFulfilled: createAction<{ addresses: Array<AddressType> }>('address/loadAllFulfilled'),
    generate: createAction<{ password: string }>('address/generate'),
    add: createAction<{ address: string, statusCode: number, successMessage: string }>('address/add'),
    edit: createAction<{ address: string, alias: string }>('address/edit'),
    editFulfilled: createAction<{ address: string, alias: string, statusCode: number, successMessage: string }>('address/editFulfilled'),
    delete: createAction<{ address: string }>('address/delete'),
    deleteFulfilled: createAction<{ address: string, statusCode: number, successMessage: string }>('address/deleteFulfilled'),
    pending: createAction('address/pending'),
    fulfilled: createAction<{ statusCode: number, successMessage: string }>('address/fulfilled'),
    rejected: createAction<{ statusCode: number, errorMessage: string }>('address/rejected'),
}

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(addressActions.loadAll, state => ({
                ...state,
                addressesLoading: true,
            }))
            .addCase(addressActions.loadAllFulfilled, (state, action) => ({
                ...state,
                addresses: action.payload.addresses,
                addressesLoading: false,
            }))
            .addCase(addressActions.add, (state, action) => ({
                ...state,
                addresses: [...state.addresses, {
                    address: action.payload.address,
                    alias: null,
                    ethAmount: 0,
                    fiatAmount: 0,
                    percentage: 0,
                    loading: false,
                }],
                statusCode: action.payload.statusCode,
                successMessage: action.payload.successMessage,
                loading: false,
            }))
            .addCase(addressActions.editFulfilled, (state, action) => ({
                ...state,
                addresses: state.addresses.map(address => {
                    if (address.address === action.payload.address) {
                        return {
                            ...address,
                            alias: action.payload.alias,
                        }
                    }
                    return address
                }),
                statusCode: action.payload.statusCode,
                successMessage: action.payload.successMessage,
                loading: false,
            }))
            .addCase(addressActions.deleteFulfilled, (state, action) => ({
                ...state,
                addresses: state.addresses.filter(address => address.address !== action.payload.address),
                statusCode: action.payload.statusCode,
                successMessage: action.payload.successMessage,
                loading: false,
            }))
            .addCase(addressActions.pending, state => ({
                ...state,
                loading: true,
                statusCode: null,
                successMessage: null,
                errorMessage: null,
            }))
            .addCase(addressActions.fulfilled, (state, action) => ({
                ...state,
                loading: false,
                statusCode: action.payload.statusCode,
                successMessage: action.payload.successMessage,
                errorMessage: null,
            }))
            .addCase(addressActions.rejected, (state, action) => ({
                ...state,
                addressesLoading: false,
                loading: false,
                statusCode: action.payload.statusCode,
                successMessage: null,
                errorMessage: action.payload.errorMessage,
            }))
})

export { addressActions }

export default addressSlice.reducer