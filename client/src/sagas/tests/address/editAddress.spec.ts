import { put, delay, select } from 'redux-saga/effects'
import { editAddress } from '../../address'
import { addressActions } from '../../../slices/address'
import { STATUS_CODES } from '../../address'
import { getSerializedKeystore } from '../../../selectors/keystore'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import store from 'store'


describe('Test *editAddress saga', () => {
    const payload = { address: 'random address', alias: 'edited' }
    // @ts-ignore
    const it = cloneableGenerator(editAddress)(addressActions.edit(payload))

    test('*editAddress should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(addressActions.pending()),
            done: false,
        })
    })

    test('*editAddress should be delayed by 300ms', () => {
        expect(it.next()).toEqual({
            value: delay(300),
            done: false,
        })
    })

    test('*editAddress should dispatch rejected action -> no serialized ks in redux', () => {
        const clone = it.clone()

        expect(clone.next(null)).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: put(addressActions.rejected({
                statusCode: STATUS_CODES.EDIT_ADDRESS,
                errorMessage: 'Can\'t edit address, wallet not initialized'
            })),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*editAddress should dispatch rejected action -> no serialized ks in local storage', () => {
        const clone = it.clone()

        expect(clone.next('random serialized')).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: put(addressActions.rejected({
                statusCode: STATUS_CODES.EDIT_ADDRESS,
                errorMessage: 'Can\'t edit address, wallet not initialized'
            })),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*editAddress should dispatch rejected action -> serialized keystores are not equal', () => {
        const clone = it.clone()

        expect(clone.next('random serialized')).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })

        const ksHash = 'random hash'
        store.set('hash', ksHash)
        store.set('all', {
            [ksHash]: {
                keystore: 'random serialized 2'
            }
        })

        expect(clone.next()).toEqual({
            value: put(addressActions.rejected({
                statusCode: STATUS_CODES.EDIT_ADDRESS,
                errorMessage: 'Can\'t edit address, wallet not initialized'
            })),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*editAddress should select serialized ks', () => {
        expect(it.next()).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })
    })

    test('*editAddress should dispatch rejected action -> address does not exist in local storage', () => {
        const clone = it.clone()

        const ksHash = 'random hash'
        store.set('hash', ksHash)
        store.set('all', {
            [ksHash]: {
                keystore: 'random serialized',
                addresses: [],
            }
        })

        expect(clone.next('random serialized')).toEqual({
            value: put(addressActions.rejected({
                statusCode: STATUS_CODES.EDIT_ADDRESS,
                errorMessage: 'Can\'t edit address, it does not exist',
            })),
            done: false,
        })
    })

    test('*editAddress should dispatch edit fulfilled action', () => {
        const ksHash = 'random hash'
        store.set('hash', ksHash)
        store.set('all', {
            [ksHash]: {
                keystore: 'random serialized',
                addresses: [payload.address],
                aliasByAddress: {
                    [payload.address]: 'first',
                }
            }
        })

        expect(it.next('random serialized')).toEqual({
            value: put(addressActions.editFulfilled({
                address: payload.address,
                alias: payload.alias,
                statusCode: STATUS_CODES.EDIT_ADDRESS,
                successMessage: 'Address successfully edited',
            })),
            done: false,
        })

        expect(store.get('all')[ksHash].aliasByAddress[payload.address]).toEqual('edited')
    })

    test('*editAddress should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})