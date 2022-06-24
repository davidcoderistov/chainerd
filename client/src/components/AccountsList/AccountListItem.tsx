import React, { useCallback } from 'react'
import { Paper, Grid, IconButton, Typography, styled } from '@mui/material'
import { Send, Edit } from '@mui/icons-material'

const GridItem = styled(Grid)({
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '16px'
})

export interface AccountListItemProps {
    address: string,
    ethAmount: number,
    fiatAmount: number,
    onEdit: (address: string) => void,
    onSend: (address: string) => void,
}

export default function AccountListItem ({ address, ethAmount, fiatAmount, onEdit, onSend } : AccountListItemProps) {

    const handleOnEdit = useCallback(
        () => {
            onEdit(address)
        },
        [onEdit]
    )

    const handleOnSend = useCallback(
        () => {
            onSend(address)
        },
        [onSend]
    )

    return (
        <Paper elevation={4} sx={{ mb: 4, px: 3 }}>
            <Grid container spacing={2}>
                <GridItem item xs={5}>
                    <Typography variant='body2'>
                        { address }
                    </Typography>
                </GridItem>
                <GridItem item xs>
                    <Typography variant='body2'>
                        { ethAmount } ETH
                    </Typography>
                </GridItem>
                <GridItem item xs>
                    <Typography variant='body2'>
                        ${ fiatAmount }
                    </Typography>
                </GridItem>
                <GridItem item xs='auto'>
                    <IconButton color='primary' aria-label='edit' component='div' onClick={handleOnEdit}>
                        <Edit />
                    </IconButton>
                    <IconButton color='primary' aria-label='send' component='div' onClick={handleOnSend}>
                        <Send />
                    </IconButton>
                </GridItem>
            </Grid>
        </Paper>
    )
}