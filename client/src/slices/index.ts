import { combineReducers } from '@reduxjs/toolkit'
import keystoreReducer from './keystore'
import addressReducer from './address'
import transactionReducer from './transaction'

const rootReducer = combineReducers({
    keystore: keystoreReducer,
    address: addressReducer,
    transaction: transactionReducer,
})

export default rootReducer