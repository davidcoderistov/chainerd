import React, { useState, useCallback } from 'react'
import {Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Grid, Button, IconButton, styled } from '@mui/material'
import PasswordInput from '../PasswordInput'
import { Close } from '@mui/icons-material'

const DialogTitleStyled = styled(DialogTitle)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

interface ConfirmPasswordModalProps {
    open: boolean,
    onClose: () => void,
    onConfirm : (password: string) => void,
    addNewAddress?: boolean,
}

export default function ConfirmPasswordModal ({ open, onClose, onConfirm, addNewAddress } : ConfirmPasswordModalProps) {

    const handleOnConfirm = useCallback(
        () => {
            onConfirm(password)
        },
        [onConfirm]
    )

    const [password, setPassword] = useState<string>('')

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const helperText = addNewAddress ? 'Your password will never be stored in the app. Please confirm it in order to add a new account.'
        : 'Your password will never be stored in the app. Please confirm it in order to send this transaction.'

    return (
        <Dialog open={open} fullWidth={true} maxWidth='xs' scroll='paper'>
            <DialogTitleStyled>
                <div/>
                <div>Confirm Password</div>
                <IconButton
                    aria-label='close'
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitleStyled>
            <DialogContent dividers={true}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <PasswordInput
                            id='outlined-adornment-password'
                            inputLabel='Password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={handleChangePassword}
                            sx={{ mb: 2 }}
                            helperText={helperText}
                            fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button sx={{ mr: 1 }} onClick={handleOnConfirm}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}