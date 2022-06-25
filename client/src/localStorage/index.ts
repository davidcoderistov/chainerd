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

function setKeystore(hash: string, keystore: string, addresses: string[]) : boolean {
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
        addresses,
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

function getKeystoreByHash (hash: string | null): string | null {
    if (hash && keystoreExistsByHash(hash)) {
        const all = getKeystoreAll()
        return all[hash].keystore
    }
    return null
}

function getCurrentKeystore (): string | null {
    return getKeystoreByHash(getKeystoreHash())
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
    keystoreExistsByHash,
    getKeystoreByHash,
    getCurrentKeystore,
}