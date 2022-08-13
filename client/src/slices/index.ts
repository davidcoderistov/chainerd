import { combineReducers } from '@reduxjs/toolkit'
import keystoreReducer from './keystore'
import addressReducer from './address'
import transactionReducer from './transaction'
import portfolioReducer from './portfolio'
import accountReducer from './account'

const rootReducer = combineReducers({
    keystore: keystoreReducer,
    address: addressReducer,
    transaction: transactionReducer,
    portfolio: portfolioReducer,
    account: accountReducer,
})

export default rootReducer