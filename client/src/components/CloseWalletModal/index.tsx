import React, { useState, useCallback } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Grid, Typography, Button, IconButton, styled } from '@mui/material'
import Snackbar from '../Snackbar'
import { Close } from '@mui/icons-material'

const DialogTitleStyled = styled(DialogTitle)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

interface CloseWalletModalProps {
    open: boolean,
    onCloseModal: () => void,
    onCloseWallet: () => void,
}

export default function CloseWalletModal ({ open, onCloseModal, onCloseWallet }: CloseWalletModalProps) {

    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

    const handleOnConfirm = useCallback( () => {
        setShowSnackbar(true)
        onCloseWallet()
    }, [onCloseWallet])

    const handleCloseSnackbar = () => {
        setShowSnackbar(false)
    }

    return (
        <React.Fragment>
            <Dialog open={open} fullWidth={true} maxWidth='xs' scroll='paper'>
                <DialogTitleStyled>
                    <div/>
                    <div>Close Wallet</div>
                    <IconButton
                        aria-label='close'
                        onClick={onCloseModal}
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
                            <Typography variant='body1'>
                                You are about to completely remove this wallet and its associated data from the browser.
                                Are you sure you want to proceed ?
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseModal}>
                        No
                    </Button>
                    <Button sx={{ mr: 1 }} onClick={handleOnConfirm}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={showSnackbar}
                error={false}
                message='Wallet successfully closed'
                onClose={handleCloseSnackbar} />
        </React.Fragment>
    )
}