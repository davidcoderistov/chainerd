import { all } from 'redux-saga/effects'
import {
    watchGenKeystore
} from './keystore'
import { watchTransaction } from './transaction'

function *rootSaga() {
    yield all([
        watchGenKeystore(),
        watchTransaction(),
    ])
}

export default rootSaga