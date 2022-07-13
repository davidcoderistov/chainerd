import { all } from 'redux-saga/effects'
import watchKeystore from './keystore'
import { watchTransaction } from './transaction'

function *rootSaga() {
    yield all([
        watchKeystore(),
        watchTransaction(),
    ])
}

export default rootSaga