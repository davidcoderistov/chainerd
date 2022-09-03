import { put } from 'redux-saga/effects'
import { setNetwork } from '../../network'
import { accountActions } from '../../../slices/account'
import { addressActions } from '../../../slices/address'
import { portfolioActions } from '../../../slices/portfolio'
import { transactionActions } from '../../../slices/transaction'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import store from 'store'


describe('Test *setNetwork saga', () => {
    const it = cloneableGenerator(setNetwork)()

    test('*setNetwork should dispatch accountActions/clearAll action', () => {
        expect(it.next()).toEqual({
            value: put(accountActions.clearAll()),
            done: false,
        })
    })

    test('*setNetwork should dispatch addressActions/clearAll action', () => {
        expect(it.next()).toEqual({
            value: put(addressActions.clearAll()),
            done: false,
        })
    })

    test('*setNetwork should dispatch portfolioActions/clearAll action', () => {
        expect(it.next()).toEqual({
            value: put(portfolioActions.clearAll()),
            done: false,
        })
    })

    test('*setNetwork should dispatch transactionActions/clearAll action', () => {
        expect(it.next()).toEqual({
            value: put(transactionActions.clearAll()),
            done: false,
        })
    })

    test('*setNetwork should not dispatch addressActions/loadAll action', () => {
        const clone = it.clone()
        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*setNetwork should dispatch addressActions/loadAll action', () => {
        const clone = it.clone()
        const hash = 'random hash'
        const keystore = 'random keystore'
        store.set('hash', hash)
        store.set('all', {
            [hash]: {
                keystore,
            }
        })
        expect(clone.next()).toEqual({
            value: put(addressActions.loadAll({ keystore })),
            done: false,
        })
        store.clearAll()
    })
})