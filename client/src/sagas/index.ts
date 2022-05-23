import { all } from 'redux-saga/effects'
import {
    watchGenKeystore
} from './keystore'

function *rootSaga() {
    yield all([
        watchGenKeystore(),
    ])
}

export default rootSaga