import { createAction, createSlice } from '@reduxjs/toolkit'
import { NETWORK, NETWORKS } from '../config'


const initialState = {
    network: NETWORKS.MAINNET
}

const networkActions = {
    setNetwork: createAction<{ network: NETWORK }>('network/setNetwork')
}

const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(networkActions.setNetwork, (state, action) => {
                state.network = action.payload.network
            })
})

export { networkActions }

export default networkSlice.reducer