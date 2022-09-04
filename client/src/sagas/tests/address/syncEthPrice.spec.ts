import { put, call, select } from 'redux-saga/effects'
import { getEthPrice } from '../../../services'
import { getAddresses } from '../../../selectors/address'
import { STATUS_CODES, syncEthPrice } from '../../address'
import { addressActions, AddressType } from '../../../slices/address'
import { toRoundedFiat } from '../../../utils'


describe('Test *syncEthPrice saga', () => {
    const it = syncEthPrice()

    test('*syncEthPrice should call getEthPrice', () => {
        expect(it.next()).toEqual({
            value: call(getEthPrice),
            done: false,
        })
    })

    test('*syncEthPrice should select addresses', () => {
        // @ts-ignore
        const next = it.next(1000)
        expect(next).toEqual({
            value: select(getAddresses),
            done: false,
        })
    })

    test('*syncEthPrice should dispatch fulfilled action', () => {
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
                address: 'second',
                alias: null,
                ethAmount: 0.7,
                fiatAmount: 870,
                percentage: 70,
                loading: false,
            }
        ]
        // @ts-ignore
        const next = it.next(addresses)
        expect(next).toEqual({
            value: put(addressActions.syncFulfilled({
                addresses: addresses.map(address => ({
                    ...address,
                    fiatAmount: Number(toRoundedFiat(address.ethAmount * 1000))
                })),
                successMessage: 'Eth price synced',
                statusCode: STATUS_CODES.SYNC_ETH_PRICE,
            })),
            done: false,
        })
    })

    test('*syncEthPrice should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})