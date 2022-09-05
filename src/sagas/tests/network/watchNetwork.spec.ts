import { takeLatest } from 'redux-saga/effects'
import watchNetwork, { setNetwork } from '../../network'
import { networkActions } from '../../../slices/network'


describe('Test *watchNetwork saga', () => {
    const it = watchNetwork()

    test('*watchKeystore should watch for *setNetwork saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(networkActions.setNetwork.type, setNetwork),
            done: false,
        })
    })

    test('*watchKeystore should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})

