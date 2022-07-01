import { combineReducers } from '@reduxjs/toolkit'
import keystoreReducer from './keystore'
import transactionReducer from './transaction'

const rootReducer = combineReducers({
    keystore: keystoreReducer,
    transaction: transactionReducer,
})

export default rootReducer