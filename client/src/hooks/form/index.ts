import { useState } from 'react'


export interface ErrorType {
    has: boolean,
    message: string,
}

export type ValidatorType = (value: string[]) => void

export const useValidator = (rules: Array<(value: string[]) => false | string>): [ErrorType, ValidatorType] => {
    const [error, setError] = useState<ErrorType>({ has: false, message: '' })

    const validate = (value: string[]) => {
        rules.some(rule => {
            const validated = rule(value)
            const newError = validated ? {
                has: true,
                message: validated,
            } : {
                has: false,
                message: '',
            }
            setError(newError)
            return newError.has
        })
    }

    return [error, validate]
}