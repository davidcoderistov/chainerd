import { useState } from 'react'
import { useDidMountEffect } from '../misc'


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

export const useFormInputValidator = (rules: Array<(value: string[]) => false | string>, values: string[], deps: any[]): [
    boolean,
    ErrorType,
    () => void,
] => {
    const [isDirty, setIsDirty] = useState(false)
    const [error, validate] = useValidator(rules)

    const onBlur = () => {
        if (!isDirty) {
            setIsDirty(true)
        }
        validate(values)
    }

    useDidMountEffect(() => {
        if (!isDirty) {
            setIsDirty(true)
        }
        validate(values)
    }, deps)

    return [isDirty, error, onBlur]
}