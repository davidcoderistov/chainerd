import React, { useState, useCallback } from 'react'
import TextInput from '../TextInput'
import { InputAdornment, IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
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

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    return (
        <React.Fragment>
            <TextInput
                id='outlined-adornment-password'
                inputLabel='Password'
                placeholder='Enter Password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleChangePassword}
                onBlur={onBlurPassword}
                error={errorPassword.has}
                helperText={errorPassword.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                sx={{ mb: 2 }}
                fullWidth />
            <TextInput
                id='outlined-adornment-confirm-password'
                placeholder='Enter Confirm Password'
                inputLabel='Confirm Password'
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleChangeConfirmPassword}
                onBlur={onBlurConfirmPassword}
                error={errorConfirmPassword.has}
                helperText={errorConfirmPassword.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                fullWidth />
        </React.Fragment>
    )
}