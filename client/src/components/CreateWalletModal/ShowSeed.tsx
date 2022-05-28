import React from 'react'
import {Typography, Button} from '@mui/material'
import SeedInfo from './SeedInfo'

interface ShowSeedProps {
    seed: string[],
    onNext: () => void,
}

export default function ShowSeed ({ seed, onNext }: ShowSeedProps) {
    return (
        <React.Fragment>
            <Typography variant='h4' sx={{ mb: 2 }}>
                Secret Recovery Phrase
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
                Your Secret Recovery Phrase makes it easy to back up and restore your account.
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
                Please make sure you store this phrase in a password manager, memorize it, write this phrase
                on a piece of paper and store in a secure location, or use any other method that you prefer.
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
                WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your Ether
                forever.
            </Typography>
            <SeedInfo seed={seed}/>
            <Button variant='contained' sx={{ mt: 2, borderRadius: 8, px: 4 }} onClick={onNext}>
                Next
            </Button>
        </React.Fragment>
    )
}