import store from 'store'

interface KeystoreType {
    keystore: string,
    addresses: string[],
    addressAliases: { [address: string]: string },
}

interface AllType {
    [hash: string]: KeystoreType
}

const KEYS = {
    HASH: 'hash',
    ALL: 'all',
}

function keystoreHashExists (): boolean {
    return !!getKeystoreHash()
}

function getKeystoreHash (): string | null {
    return store.get(KEYS.HASH)
}

function setKeystoreHash (hash: string | null): void {
    store.set(KEYS.HASH, hash)
}

function keystoreAllExists (): boolean {
    return !!getKeystoreAll()
}

function getKeystoreAll (): AllType {
    return store.get(KEYS.ALL)
}

function setKeystoreAll (all: AllType): void {
    store.set(KEYS.ALL, all)
}

function addKeystore (hash: string, keystore: KeystoreType): void {
    if (!keystoreAllExists()) {
        setKeystoreAll({})
    }
    const all = getKeystoreAll()
    setKeystoreAll({
        ...all,
        [hash]: keystore,
    })
}

function setKeystore(hash: string, keystore: string, address: string) : boolean {
    if (!keystoreAllExists()) {
        setKeystoreAll({})
    }
    if (!keystoreExistsByHash(hash)) {
        return false
    }
    const all = getKeystoreAll()
    const ks = all[hash]
    addKeystore(hash, {
        ...ks,
        keystore,
        addresses: [...ks.addresses, address],
    })
    return true
}

function setAddressAlias(hash: string, address: string, alias: string): boolean {
    if (!keystoreAllExists()) {
        setKeystoreAll({})
    }
    if (!keystoreExistsByHash(hash)) {
        return false
    }
    const all = getKeystoreAll()
    const ks = all[hash]
    addKeystore(hash, {
        ...ks,
        addressAliases: {
            ...ks.addressAliases,
            [address]: alias,
        }
    })
    return true
}

function deleteAddress (hash: string, address: string): boolean {
    if (!keystoreAllExists()) {
        setKeystoreAll({})
    }
    if (!keystoreExistsByHash(hash)) {
        return false
    }
    const all = getKeystoreAll()
    const ks = all[hash]
    addKeystore(hash, {
        ...ks,
        addresses: ks.addresses.filter(addr => addr !== address)
    })
    return true
}

function keystoreExistsByHash (hash: string | null): boolean {
    if (hash) {
        const all = getKeystoreAll()
        return (all && all.hasOwnProperty(hash) && all[hash].hasOwnProperty('keystore'))
    }
    return false
}

function getKeystoreObjByHash (hash: string | null): KeystoreType | null {
    if (hash && keystoreExistsByHash(hash)) {
        const all = getKeystoreAll()
        return all[hash]
    }
    return null
}

function getKeystoreByHash (hash: string | null): string | null {
    const keystoreObj = getKeystoreObjByHash(hash)
    if (keystoreObj && keystoreObj.hasOwnProperty('keystore')) {
        return keystoreObj.keystore
    }
    return null
}

function getAddressesByHash (hash: string | null): string[] | null {
    const keystoreObj = getKeystoreObjByHash(hash)
    if (keystoreObj && keystoreObj.hasOwnProperty('addresses')) {
        return keystoreObj.addresses
    }
    return null
}

function getAddressAliasesByHash (hash: string | null): KeystoreType['addressAliases'] | null {
    const keystoreObj = getKeystoreObjByHash(hash)
    if (keystoreObj && keystoreObj.hasOwnProperty('addressAliases')) {
        return keystoreObj.addressAliases
    }
    return null
}

function getCurrentKeystore (): string | null {
    return getKeystoreByHash(getKeystoreHash())
}

function getCurrentAddresses (): string[] | null {
    return getAddressesByHash(getKeystoreHash())
}

function getCurrentAddressAliases (): KeystoreType['addressAliases'] | null {
    return getAddressAliasesByHash(getKeystoreHash())
}

export {
    KEYS,
    keystoreHashExists,
    getKeystoreHash,
    setKeystoreHash,
    keystoreAllExists,
    getKeystoreAll,
    setKeystoreAll,
    addKeystore,
    setKeystore,
    setAddressAlias,
    deleteAddress,
    keystoreExistsByHash,
    getKeystoreObjByHash,
    getKeystoreByHash,
    getCurrentKeystore,
    getAddressesByHash,
    getCurrentAddresses,
    getAddressAliasesByHash,
    getCurrentAddressAliases,
}