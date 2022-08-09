import React from 'react'
import { Box, Typography, Button } from '@mui/material'


export interface NoWalletPageProps {
    onCreateWallet: () => void
    onRestoreWallet: () => void
}

export default function NoWalletPage ({ onCreateWallet, onRestoreWallet }: NoWalletPageProps) {

    return (
        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
            <Typography variant='h5'>
                Welcome to Chainerd
            </Typography>
            <Typography variant='h5'>
                To begin, create or restore Ethereum wallet
            </Typography>
            <Typography variant='body1' color='text.secondary' marginTop='40px'>
                Chainerd is a zero-client. Connection to Ethereum network is made via Infura / local node. Keystore
                is encrypted using the password. All keys are saved inside the browser and never sent.
            </Typography>
            <Box display='flex' flexDirection='row' justifyContent='center' columnGap='20px' marginTop='30px'>
                <Button sx={{ textTransform: 'none' }} size='large' onClick={onCreateWallet}>
                    Create wallet
                </Button>
                <Button sx={{ textTransform: 'none' }} size='large' onClick={onRestoreWallet}>
                    Restore wallet
                </Button>
            </Box>
        </Box>
    )
}