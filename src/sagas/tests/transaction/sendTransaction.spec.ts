import { call, put, select } from 'redux-saga/effects'
import { sendTransaction, STATUS_CODES } from '../../transaction'
import { transactionActions } from '../../../slices/transaction'
import { getKeystore } from '../../../selectors/keystore'
import { getEthAmount, getGasPrice } from '../../../selectors/transaction'
import { createVault, keyFromPassword } from '../../../utils'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import { keystore } from 'eth-lightwallet'
import store from 'store'

async function getKs (password: string) {
    const randomSeed = 'season kitchen cactus bring junior consider close cake fix doll month thing'
    return await createVault({
        password,
        seedPhrase: randomSeed,
        hdPathString: 'm/44\'/60\'/0\'/0',
    })
}


describe('Test *sendTransaction saga', () => {
    const payload = {
        fromAddress: '0x4281eCF07378Ee595C564a59048801330f3084eE',
        toAddress: '0xcDC8E4EEF1441e8f1a4759C567bfB53EfA51944F',
        password: 'random password',
    }
    const it = cloneableGenerator(sendTransaction)(transactionActions.sendTransaction(payload))

    let ks: keystore

    beforeAll(async () => {
        ks = await getKs(payload.password)
    })

    test('*sendTransaction should dispatch pending action', () => {
        expect(it.next()).toEqual({
            value: put(transactionActions.pending()),
            done: false,
        })
    })

    test('*sendTransaction should select keystore', () => {
        expect(it.next()).toEqual({
            value: select(getKeystore),
            done: false,
        })
    })

    test('*sendTransaction should dispatch rejected action -> wallet not initialized', () => {
        const clone = it.clone()
        expect(clone.next(null)).toEqual({
            value: put(transactionActions.rejected({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                errorMessage: 'Wallet is not initialized',
            })),
            done: false,
        })
    })

    test('*sendTransaction should call keyFromPassword', async () => {
        expect(it.next(ks)).toEqual({
            value: call(keyFromPassword, ks, payload.password),
            done: false,
        })
    })

    test('*sendTransaction should dispatch rejected action -> incorrect derived key',  async () => {
        const clone = it.clone()

        const ks: keystore = await getKs('another password')
        const pwDerivedKey: Uint8Array = await keyFromPassword(ks, 'another password')

        expect(clone.next(pwDerivedKey)).toEqual({
            value: put(transactionActions.rejected({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                errorMessage: 'Incorrect derived key !',
            })),
            done: false,
        })
    })

    test('*sendTransaction should select eth amount', async () => {
        const pwDerivedKey: Uint8Array = await keyFromPassword(ks, payload.password)

        expect(it.next(pwDerivedKey)).toEqual({
            value: select(getEthAmount),
            done: false,
        })
    })

    test('*sendTransaction should select gas price', () => {
        expect(it.next('0.3')).toEqual({
            value: select(getGasPrice),
            done: false,
        })
    })

    test('*sendTransaction should dispatch rejected action -> no keystore hash in local storage', () => {
        const clone = it.clone()

        expect(clone.next()).toEqual({
            value: put(transactionActions.rejected({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                errorMessage: 'Can\'t use nonce, wallet not initialized'
            })),
            done: false,
        })
    })

    test('*sendTransaction should dispatch rejected action -> no keystore in local storage', () => {
        const clone = it.clone()

        store.set('hash', 'random hash')

        expect(clone.next()).toEqual({
            value: put(transactionActions.rejected({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                errorMessage: 'Can\'t use nonce, wallet not initialized'
            })),
            done: false,
        })
    })

    test('*sendTransaction should dispatch rejected action -> no keystore address in local storage', () => {
        const clone = it.clone()

        const ksHash = 'random hash'
        store.set('hash', ksHash)
        store.set('all', {
            [ksHash]: {
                addresses: [],
                nonceByAddress: {},
            }
        })

        expect(clone.next()).toEqual({
            value: put(transactionActions.rejected({
                statusCode: STATUS_CODES.SEND_TRANSACTION,
                errorMessage: 'Can\'t use nonce, address does not exist'
            })),
            done: false,
        })
    })
})