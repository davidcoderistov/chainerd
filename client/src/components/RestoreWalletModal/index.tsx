import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material'
import { Grid, IconButton, styled } from '@mui/material'
import { Close } from '@mui/icons-material'
import PasswordInput from '../PasswordInput'
import Label from '../Label'
import SeedInfo from '../SeedInfo'


const DialogTitleStyled = styled(DialogTitle)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

export default function RestoreWalletModal () {

    const [seed, setSeed] = useState<string[]>(['entry', 'pattern', 'luggage', 'exotic', 'kick', 'champion', 'crime', 'duck', 'story', 'jump', 'sure', 'impulse'])

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
                                sx={{ mb: 2 }}
                                fullWidth />
                            <Label value='Seed Phrase' />
                            <SeedInfo
                                seed={seed}
                                writable />
                        </Grid>
                    </Grid>
                </div>
            </DialogContent>
            <DialogActions>
                <Button sx={{ mr:1 }}>
                    Restore
                </Button>
            </DialogActions>
        </Dialog>
    )
}