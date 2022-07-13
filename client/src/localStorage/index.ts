import store from 'store'
import { serializeKeystore, deserializeKeystore } from '../utils'

const STORE_KEYS = {
    HASH: 'hash',
    ALL: 'all',
}

interface Keystore {
    keystore: string
    addresses: string[]
    aliasByAddress: { [address: string]: string}
    nonceByAddress: { [address: string]: number}
}

export const getCurrentKeystoreHash = (): string | null => store.get(STORE_KEYS.HASH)

export const setCurrentKeystoreHash = (hash: string | null) => store.set(STORE_KEYS.HASH, hash)

export const addKeystore = (ksHash: string, ksSerialized: string) => {
    setCurrentKeystoreHash(ksHash)
    setKeystore(ksHash, {
        keystore: ksSerialized,
        addresses: [],
        aliasByAddress: {},
        nonceByAddress: {},
    })
}

export const restoreKeystore = (ksHash: string): string => {
    if (getCurrentKeystoreHash()) {
        throw new Error('Can\'t restore wallet, already initialized')
    }
    const keystore = getKeystore(ksHash)
    if (!keystore) {
        throw new Error('Can\'t restore wallet, it does not exist')
    }
    setCurrentKeystoreHash(ksHash)
    return keystore.keystore
}

export const addAddress = (pwDerivedKey: Uint8Array): { ksSerialized: string, addresses: string[] } => {
    const ksHash = getCurrentKeystoreHash()
    if (!ksHash) {
        throw new Error('Can\'t add address, wallet not initialized')
    }
    const keystore = getKeystore(ksHash)
    if (!keystore) {
        throw new Error('Can\'t add address, wallet not initialized')
    }
    const ks = deserializeKeystore(keystore.keystore)
    if (!ks.isDerivedKeyCorrect(pwDerivedKey)) {
        throw new Error('Incorrect derived key')
    }
    ks.generateNewAddress(pwDerivedKey, 1)
    const serialized = serializeKeystore(ks)
    const address = ks.getAddresses()[ks.getAddresses().length - 1]
    const addresses = [...keystore.addresses, address]
    setKeystore(ksHash, {
        ...keystore,
        keystore: serialized,
        addresses,
        nonceByAddress: {...keystore.nonceByAddress, [address]: 0},
    })
    return {
        ksSerialized: serialized,
        addresses,
    }
}

export const editAddress  = (address: string, alias: string) => {
    const ksHash = getCurrentKeystoreHash()
    if (!ksHash) {
        throw new Error('Can\'t edit address, wallet not initialized')
    }
    const keystore = getKeystore(ksHash)
    if (!keystore) {
        throw new Error('Can\'t edit address, wallet not initialized')
    }
    if (!keystore.addresses.some(addr => addr === address)) {
        throw new Error('Can\'t edit address, it does not exist')
    }
    setKeystore(ksHash, {
        ...keystore,
        aliasByAddress: {...keystore.aliasByAddress, [address]: alias}
    })
}

export const deleteAddress = (address: string) => {
    const ksHash = getCurrentKeystoreHash()
    if (!ksHash) {
        throw new Error('Can\'t delete address, wallet not initialized')
    }
    const keystore = getKeystore(ksHash)
    if (!keystore) {
        throw new Error('Can\'t delete address, wallet not initialized')
    }
    if (!keystore.addresses.some(addr => addr === address)) {
        throw new Error('Can\'t delete address, it does not exist')
    }
    setKeystore(ksHash, {
        ...keystore,
        addresses: keystore.addresses.filter(addr => addr !== address)
    })
}

export const getNonce = (address: string): number => {
    const ksHash = getCurrentKeystoreHash()
    if (!ksHash) {
        throw new Error('Can\'t use nonce, wallet not initialized')
    }
    const keystore = getKeystore(ksHash)
    if (!keystore) {
        throw new Error('Can\'t use nonce, wallet not initialized')
    }
    if (!keystore.addresses.some(addr => addr === address) || !keystore.nonceByAddress.hasOwnProperty(address)) {
        throw new Error('Can\'t use nonce, address does not exist')
    }
    return keystore.nonceByAddress[address]
}

export const incrementNonce = (address: string) => {
    const ksHash = getCurrentKeystoreHash()
    if (!ksHash) {
        throw new Error('Can\'t increment nonce, wallet not initialized')
    }
    const keystore = getKeystore(ksHash)
    if (!keystore) {
        throw new Error('Can\'t increment nonce, wallet not initialized')
    }
    if (!keystore.addresses.some(addr => addr === address)) {
        throw new Error('Can\'t delete address, it does not exist')
    }
    try {
        const nonce = getNonce(address)
        setKeystore(ksHash, {
            ...keystore,
            nonceByAddress: {...keystore.nonceByAddress, [address]: nonce + 1}
        })
    } catch (error: any) {
        throw error
    }
}

export const getCurrentSerializedKeystore = (): string | null => {
    const ksHash = getCurrentKeystoreHash()
    if (!ksHash) {
        return null
    }
    const keystore = getKeystore(ksHash)
    if (!keystore) {
        return null
    }
    return keystore.keystore
}

export const getKeystore = (ksHash: string): Keystore | null => {
    if (!store.get(STORE_KEYS.ALL)) {
        return null
    }
    const all = store.get(STORE_KEYS.ALL)
    return all.hasOwnProperty(ksHash) ? all[ksHash] : null
}

export const setKeystore = (ksHash: string, keystore: Keystore) => {
    if (!store.get(STORE_KEYS.ALL)) {
        store.set(STORE_KEYS.ALL, {})
    }
    store.set(STORE_KEYS.ALL, {
        ...store.get(STORE_KEYS.ALL),
        [ksHash]: keystore
    })
}