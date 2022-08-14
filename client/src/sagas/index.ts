import { all } from 'redux-saga/effects'
import watchKeystore from './keystore'
import watchTransaction from './transaction'
import watchAddress from './address'
import watchPortfolio from './portfolio'
import watchAccount from './account'

function *rootSaga() {
    yield all([
        watchKeystore(),
        watchTransaction(),
        watchAddress(),
        watchPortfolio(),
        watchAccount(),
    ])
}

export default rootSaga