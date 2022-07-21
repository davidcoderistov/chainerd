import { all } from 'redux-saga/effects'
import watchKeystore from './keystore'
import watchTransaction from './transaction'
import watchAddress from './address'
import watchPortfolio from './portfolio'

function *rootSaga() {
    yield all([
        watchKeystore(),
        watchTransaction(),
        watchAddress(),
        watchPortfolio(),
    ])
}

export default rootSaga