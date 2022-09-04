import { put, delay, select } from 'redux-saga/effects'
import { deleteAddress } from '../../address'
import { addressActions, AddressType } from '../../../slices/address'
import { STATUS_CODES } from '../../address'
import { getSerializedKeystore } from '../../../selectors/keystore'
import { getAddresses } from '../../../selectors/address'
import { distributePercentages } from '../../../utils'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import store from 'store'


describe('Test *deleteAddress saga', () => {
    const payload = { address: 'random address' }
    // @ts-ignore
    const it = cloneableGenerator(deleteAddress)(addressActions.delete(payload))

    test('*deleteAddress should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(addressActions.pending()),
            done: false,
        })
    })

    test('*deleteAddress should be delayed by 300ms', () => {
        expect(it.next()).toEqual({
            value: delay(300),
            done: false,
        })
    })

    test('*deleteAddress should dispatch rejected action -> no serialized ks in redux', () => {
        const clone = it.clone()

        expect(clone.next(null)).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: put(addressActions.rejected({
                statusCode: STATUS_CODES.DELETE_ADDRESS,
                errorMessage: 'Can\'t delete address, wallet not initialized'
            })),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*deleteAddress should dispatch rejected action -> no serialized ks in local storage', () => {
        const clone = it.clone()

        expect(clone.next('random serialized')).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: put(addressActions.rejected({
                statusCode: STATUS_CODES.DELETE_ADDRESS,
                errorMessage: 'Can\'t delete address, wallet not initialized'
            })),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*deleteAddress should dispatch rejected action -> serialized keystores are not equal', () => {
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
                statusCode: STATUS_CODES.DELETE_ADDRESS,
                errorMessage: 'Can\'t delete address, wallet not initialized'
            })),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*deleteAddress should selected serialized ks', () => {
        expect(it.next()).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })
    })

    test('*deleteAddress should dispatch delete fulfilled action', () => {
        const ksHash = 'random hash'
        store.set('hash', ksHash)
        store.set('all', {
            [ksHash]: {
                keystore: 'random serialized',
                addresses: [payload.address],
            }
        })
        expect(it.next('random serialized')).toEqual({
            value: put(addressActions.deleteFulfilled({
                address: payload.address,
                statusCode: STATUS_CODES.DELETE_ADDRESS,
                successMessage: 'Address successfully deleted',
            })),
            done: false,
        })
    })

    test('*deleteAddress should select addresses', () => {
        expect(it.next()).toEqual({
            value: select(getAddresses),
            done: false,
        })
    })

    test('*deleteAddress should dispatch address load all fulfilled action', () => {
        const addresses: AddressType[] = [
            {
                address: 'first',
                alias: null,
                ethAmount: 0.3,
                fiatAmount: 330,
                percentage: 30,
                loading: false,
            },
            {
                address: payload.address,
                alias: null,
                ethAmount: 0.7,
                fiatAmount: 870,
                percentage: 70,
                loading: false,
            }
        ]
        const filteredAddresses = addresses.filter(address => address.address !== payload.address)
        const percentages = distributePercentages(filteredAddresses.map(address => address.ethAmount))
        expect(it.next(addresses)).toEqual({
            value: put(addressActions.loadAllFulfilled({
                addresses: filteredAddresses.map((address, index) => ({
                    ...address,
                    percentage: percentages[index]
                }))
            })),
            done: false,
        })
    })

    test('*deleteAddress should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})