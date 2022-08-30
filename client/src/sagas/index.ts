import { all } from 'redux-saga/effects'
import watchKeystore from './keystore'
import watchTransaction from './transaction'
import watchAddress from './address'
import watchPortfolio from './portfolio'
import watchNetwork from './network'

function *rootSaga() {
    yield all([
        watchKeystore(),
        watchTransaction(),
        watchAddress(),
        watchPortfolio(),
        watchNetwork(),
    ])
}

export default rootSaga