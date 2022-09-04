import { put, call, select } from 'redux-saga/effects'
import { generateAddress } from '../../address'
import { addressActions } from '../../../slices/address'
import { STATUS_CODES } from '../../address'
import { getSerializedKeystore } from '../../../selectors/keystore'
import { keyFromPassword, createVault, serializeKeystore, getKsHash } from '../../../utils'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import store from 'store'
import { keystore } from 'eth-lightwallet'


async function setup (password: string) {
    const seed = 'thumb glory burst aunt home balcony woman hub similar piece luxury peanut'
    const ks: keystore = await createVault({
        password: password,
        seedPhrase: seed,
        hdPathString: 'm/44\'/60\'/0\'/0',
    })

    const ksHash = getKsHash(password, seed)
    store.set('hash', ksHash)
    store.set('all', {
        [ksHash]: {
            keystore: serializeKeystore(ks),
            addresses: [],
            nonceByAddress: {},
        }
    })

    return ks
}

describe('Test *generateAddress saga', () => {
    const payload = { password: 'random password' }
    // @ts-ignore
    const it = cloneableGenerator(generateAddress)(addressActions.generate(payload))

    test('*generateAddress should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(addressActions.pending()),
            done: false,
        })
    })

    test('*generateAddress should dispatch rejected action -> no serialized ks in redux', () => {
        const clone = it.clone()

        expect(clone.next(null)).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: put(addressActions.rejected({
                statusCode: STATUS_CODES.GENERATE_ADDRESS,
                errorMessage: 'Can\'t generate address, wallet not initialized'
            })),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*generateAddress should dispatch rejected action -> no serialized ks in local storage', () => {
        const clone = it.clone()

        expect(clone.next('random serialized')).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: put(addressActions.rejected({
                statusCode: STATUS_CODES.GENERATE_ADDRESS,
                errorMessage: 'Can\'t generate address, wallet not initialized'
            })),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*generateAddress should dispatch rejected action -> serialized keystores are not equal', () => {
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
                statusCode: STATUS_CODES.GENERATE_ADDRESS,
                errorMessage: 'Can\'t generate address, wallet not initialized'
            })),
            done: false,
        })

        expect(clone.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

    test('*generateAddress should select serialized ks', () => {
        expect(it.next()).toEqual({
            value: select(getSerializedKeystore),
            done: false,
        })
    })

    test('*generateAddress should call keyFromPassword', async () => {
        const ks: keystore = await setup(payload.password)

        expect(it.next(serializeKeystore(ks))).toEqual({
            value: call(keyFromPassword, ks, payload.password),
            done: false,
        })
    })

    test('*generateAddress should dispatch rejected action with incorrect derived key', async () => {
        const clone = it.clone()

        const randomSeed = 'season kitchen cactus bring junior consider close cake fix doll month thing'
        const ks: keystore = await createVault({
            password: 'random password',
            seedPhrase: randomSeed,
            hdPathString: 'm/44\'/60\'/0\'/0',
        })
        const pwDerivedKey: Uint8Array = await keyFromPassword(ks, 'random password')

        expect(clone.next(pwDerivedKey)).toEqual({
            value: put(addressActions.rejected({
                statusCode: STATUS_CODES.GENERATE_ADDRESS,
                errorMessage: 'Incorrect derived key',
            })),
            done: false,
        })
    })

    test('*generateAddress should dispatch fulfilled actions correctly', async () => {
        const ks: keystore = await setup(payload.password)
        const pwDerivedKey: Uint8Array = await keyFromPassword(ks, payload.password)

        it.next(pwDerivedKey)

        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})