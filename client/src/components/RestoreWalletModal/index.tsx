import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createWallet } from '../../slices/keystore'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Grid, IconButton, styled } from '@mui/material'
import { Close } from '@mui/icons-material'
import PasswordInput from '../PasswordInput'
import Label from '../Label'
import SeedInfo from '../SeedInfo'
import Snackbar from '../Snackbar'
import { useFormInputValidator } from '../../hooks'
import { getKeystore, getError, getLoading, getErrorCode } from '../../selectors/keystore'
import { keystore } from 'eth-lightwallet'
import _range from 'lodash/range'

const passwordRules = [
    ([value]: string[]) => value.trim().length < 1 && 'Required',
    ([value]: string[]) => value.trim().length < 8 && 'Password must be at least 8 characters long',
]

const DialogTitleStyled = styled(DialogTitle)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

interface RestoreWalletModalProps {
    open: boolean,
    onRestoreWallet: () => void,
    onClose: () => void,
}

export default function RestoreWalletModal ({ open, onRestoreWallet, onClose }: RestoreWalletModalProps) {

    const dispatch = useDispatch()

    const [seed, setSeed] = useState<string[]>(_range(12).map(() => ''))

    const handleOnChangeWord = (index: number, value: string) => {
        if (index < seed.length) {
            const newSeed = Array.from(seed)
            newSeed[index] = value
            setSeed(newSeed)
        }
    }

    const [password, setPassword] = useState<string>('')
    const [isPasswordDirty, errorPassword, handleBlurPassword] = useFormInputValidator(passwordRules, [password], [password])

    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')

    const createKeystore = useSelector(getKeystore)
    const createError = useSelector(getError)
    const createErrorCode = useSelector(getErrorCode)
    const createLoading = useSelector(getLoading)

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleCloseSnackbar = () => {
        setShowSnackbar(false)
    }

    const handleOnRestore = () => {
        dispatch(createWallet.restore({
            password,
            seedPhrase: seed.join(' '),
            hdPathString: 'm/44\'/60\'/0\'/0',
        }))
    }

    useEffect(() => {
        if (createKeystore && !createError) {
            setShowSnackbar(true)
            setSnackbarMessage('Wallet successfully restored')
            onRestoreWallet()
        }
    }, [createKeystore, createError, onRestoreWallet])

    useEffect(() => {
        if (createError) {
            setShowSnackbar(true)
            setSnackbarMessage(createError)
        }
    }, [createError])

    const restoreDisabled = !isPasswordDirty || errorPassword.has || createErrorCode === 2 || !keystore.isSeedValid(seed.join(' '))

    return (
        <React.Fragment>
            <Dialog open={open} fullWidth maxWidth='sm' scroll='paper'>
                <DialogTitleStyled>
                    <div/>
                    <div>Restore Wallet</div>
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
                    <div style={{ height: '400px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ mt: 1, mx: 1 }}>
                                <PasswordInput
                                    id='outlined-adornment-password'
                                    inputLabel='Password'
                                    placeholder='Enter password for keystore encryption'
                                    value={password}
                                    onChange={handleChangePassword}
                                    onBlur={handleBlurPassword}
                                    error={errorPassword.has}
                                    helperText={errorPassword.message}
                                    sx={{ mb: 2 }}
                                    fullWidth />
                                <Label value='Seed Phrase' />
                                <SeedInfo
                                    seed={seed}
                                    writable
                                    onChangeWord={handleOnChangeWord} />
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        sx={{ mr:1 }}
                        loading={createLoading}
                        disabled={restoreDisabled}
                        onClick={handleOnRestore}>
                        Restore
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={showSnackbar}
                error={!!createError}
                message={snackbarMessage}
                onClose={handleCloseSnackbar} />
        </React.Fragment>
    )
}