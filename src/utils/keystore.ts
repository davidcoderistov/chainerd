import { keystore, VaultOptions } from 'eth-lightwallet'
import { plainToInstance, instanceToPlain } from 'class-transformer'
import keccak256 from 'keccak256'

export function createVault(opts: VaultOptions): Promise<keystore> {
    return new Promise((resolve, reject) => {
        keystore.createVault(opts, (error, ks) => {
            if (error) {
                return reject(error)
            }
            return resolve(ks)
        })
    })
}

export function keyFromPassword(ks: keystore, password: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        ks.keyFromPassword(password, (error, pwDerivedKey) => {
            if (error) {
                return reject(error)
            }
            return resolve(pwDerivedKey)
        })
    })
}

export function serializeKeystore (ks: keystore): string {
    return JSON.stringify(instanceToPlain(ks))
}

export function deserializeKeystore(ks: string): keystore {
    return plainToInstance(keystore, JSON.parse(ks))
}

export function getKsHash (password: string, seed: string) {
    return keccak256(`${password} ${seed}`).toString('hex')
}