import React, { useState } from 'react'
import TextInput, { TextInputProps } from '../TextInput'
import { IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'



export default function PasswordInput (props: TextInputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    return (
        <TextInput
            {...props}
            type={ showPassword ? 'text' : 'password' }
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'>
                            { showPassword ? <VisibilityOff /> : <Visibility /> }
                        </IconButton>
                    </InputAdornment>
                )
            }} />
    )
}