import React from 'react'
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
    onEdit: () => void,
    onSend: () => void,
}

export default function AccountListItem ({ address, ethAmount, fiatAmount, onEdit, onSend } : AccountListItemProps) {
    return (
        <Paper elevation={4} sx={{ mb: 4, px: 3 }}>
            <Grid container spacing={2}>
                <GridItem item xs={4}>
                    <Typography variant='body1'>
                        { address }
                    </Typography>
                </GridItem>
                <GridItem item xs>
                    <Typography variant='body1'>
                        { ethAmount } ETH
                    </Typography>
                </GridItem>
                <GridItem item xs>
                    <Typography variant='body1'>
                        ${ fiatAmount }
                    </Typography>
                </GridItem>
                <GridItem item xs='auto'>
                    <IconButton color="primary" aria-label="upload picture" component="div" onClick={onEdit}>
                        <Edit />
                    </IconButton>
                    <IconButton color="primary" aria-label="upload picture" component="div" onClick={onSend}>
                        <Send />
                    </IconButton>
                </GridItem>
            </Grid>
        </Paper>
    )
}