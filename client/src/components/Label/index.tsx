import React from 'react'
import { Typography } from '@mui/material'


export default function Label ({ value } : { value: string }) {

    return (
        <Typography
            component='div'
            variant='subtitle2'
            gutterBottom
            sx={{ color: '#909090' }}
        >
            { value }
        </Typography>
    )
}