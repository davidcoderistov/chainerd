import { all } from 'redux-saga/effects'
import watchKeystore from '../../keystore'
import watchTransaction from '../../transaction'
import watchAddress from '../../address'
import watchPortfolio from '../../portfolio'
import watchNetwork from '../../network'
import rootSaga from '../../index'

describe('Test *rootSaga saga', () => {
    const it = rootSaga()

    test('*rootSaga should start all child sagas', () => {
        expect(it.next()).toEqual({
            value: all([
                watchKeystore(),
                watchTransaction(),
                watchAddress(),
                watchPortfolio(),
                watchNetwork(),
            ]),
            done: false,
        })
    })

    test('*rootSaga should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})