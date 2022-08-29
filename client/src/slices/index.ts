import { combineReducers } from '@reduxjs/toolkit'
import keystoreReducer from './keystore'
import addressReducer from './address'
import transactionReducer from './transaction'
import portfolioReducer from './portfolio'
import accountReducer from './account'
import networkReducer from './network'

const rootReducer = combineReducers({
    keystore: keystoreReducer,
    address: addressReducer,
    transaction: transactionReducer,
    portfolio: portfolioReducer,
    account: accountReducer,
    network: networkReducer,
})

export default rootReducer