import { all } from 'redux-saga/effects'
import watchKeystore from './keystore'
import watchTransaction from './transaction'
import watchAddress from './address'

function *rootSaga() {
    yield all([
        watchKeystore(),
        watchTransaction(),
        watchAddress(),
    ])
}

export default rootSaga