import React from 'react'
import {Typography } from '@mui/material'
import SeedInfo from './SeedInfo'

interface ShowSeedProps {
    seed: string[]
}

export default function ShowSeed ({ seed }: ShowSeedProps) {
    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}