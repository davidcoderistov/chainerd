import React from 'react'
import { Box, AppBar, Toolbar, Button, Typography } from '@mui/material'

interface AppToolbarProps {
    walletExists: boolean,
    onCreateWallet: () => void,
    onRestoreWallet: () => void,
    onSendTransaction: () => void,
    onCloseWallet: () => void,
}

export default function AppToolbar ({ walletExists, onCreateWallet, onRestoreWallet, onSendTransaction, onCloseWallet } : AppToolbarProps) {
    return (
        <AppBar position='static' sx={{ backgroundColor: '#29242D' }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    Chainerd
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex', columnGap: '10px' } }}>
                    { walletExists ? (
                        <React.Fragment>
                            <Button color='primary' variant='outlined' onClick={onSendTransaction}>
                                Send Transaction
                            </Button>
                            <Button color='warning' variant='outlined' onClick={onCloseWallet}>
                                Close Wallet
                            </Button>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Button color='primary' variant='outlined' onClick={onCreateWallet}>
                                Create Wallet
                            </Button>
                            <Button color='warning' variant='outlined' onClick={onRestoreWallet}>
                                Restore Wallet
                            </Button>
                        </React.Fragment>
                        )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}