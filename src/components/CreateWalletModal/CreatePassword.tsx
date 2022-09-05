import React, { useCallback } from 'react'
import PasswordInput from '../PasswordInput'
import { ErrorType } from '../../hooks'


export const passwordRules = [
    ([value]: string[]) => value.trim().length < 1 && 'Required',
    ([value]: string[]) => value.trim().length < 8 && 'Password must be at least 8 characters long',
]

export const confirmPasswordRules = [
    ([value]: string[]) => value.trim().length < 1 && 'Required',
    ([value, other]: string[]) => value.trim() !== other.trim() && 'Passwords do not match',
]


interface CreatePasswordProps {
    password: string,
    onChangePassword: (password: string) => void,
    onBlurPassword: () => void,
    errorPassword: ErrorType,
    confirmPassword: string,
    onChangeConfirmPassword: (confirmPassword: string) => void,
    onBlurConfirmPassword: () => void,
    errorConfirmPassword: ErrorType,
}

export default function CreatePassword (props: CreatePasswordProps) {
    const {
        password,
        onChangePassword,
        onBlurPassword,
        errorPassword,
        confirmPassword,
        onChangeConfirmPassword,
        onBlurConfirmPassword,
        errorConfirmPassword,
    } = props

    const handleChangePassword = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangePassword(event.target.value)
        },
        [onChangePassword]
    )

    const handleChangeConfirmPassword = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeConfirmPassword(event.target.value)
        },
        [onChangeConfirmPassword]
    )

    return (
        <React.Fragment>
            <PasswordInput
                id='outlined-adornment-password'
                inputLabel='Password'
                placeholder='Enter Password'
                value={password}
                onChange={handleChangePassword}
                onBlur={onBlurPassword}
                error={errorPassword.has}
                helperText={errorPassword.message}
                sx={{ mb: 2 }}
                fullWidth />
            <PasswordInput
                id='outlined-adornment-confirm-password'
                placeholder='Enter Confirm Password'
                inputLabel='Confirm Password'
                value={confirmPassword}
                onChange={handleChangeConfirmPassword}
                onBlur={onBlurConfirmPassword}
                error={errorConfirmPassword.has}
                helperText={errorConfirmPassword.message}
                fullWidth />
        </React.Fragment>
    )
}