import { combineReducers } from '@reduxjs/toolkit'

import keystoreReducer from './keystore'

const rootReducer = combineReducers({
    keystore: keystoreReducer,
})

export default rootReducer