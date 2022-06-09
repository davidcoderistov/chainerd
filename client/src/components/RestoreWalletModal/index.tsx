import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material'
import { Grid, IconButton, styled } from '@mui/material'
import { Close } from '@mui/icons-material'
import PasswordInput from '../PasswordInput'
import Label from '../Label'
import SeedInfo from '../SeedInfo'
import { useFormInputValidator } from '../../hooks'
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

export default function RestoreWalletModal () {

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

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    return (
        <Dialog open={true} fullWidth maxWidth='sm' scroll='paper'>
            <DialogTitleStyled>
                <div/>
                <div>Restore Wallet</div>
                <IconButton
                    aria-label='close'
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
                <Button sx={{ mr:1 }} disabled={!isPasswordDirty || errorPassword.has}>
                    Restore
                </Button>
            </DialogActions>
        </Dialog>
    )
}