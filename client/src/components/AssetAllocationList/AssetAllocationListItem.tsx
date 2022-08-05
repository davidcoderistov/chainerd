import React from 'react'
import { Box, Typography, styled } from '@mui/material'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import ListItem from './ListItem'


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#0ebdcd',
    },
}))

export interface AssetAllocationListItemProps {
    account: string
    address: string
    amount: number
    value: number
    allocation: number
}

export default function AssetAllocationListItem ({ account, address, amount, value, allocation } : AssetAllocationListItemProps) {
    return (
        <ListItem>
            <Typography noWrap variant='body2'>
                { account }
            </Typography>
            <Typography noWrap variant='body2'>
                { address }
            </Typography>
            <Typography noWrap variant='body2'>
                { amount } ETH
            </Typography>
            <Typography noWrap variant='body2'>
                ${ value }
            </Typography>
            <React.Fragment>
                <Box sx={{ minWidth: 50, textAlign: 'end' }}>
                    <Typography noWrap variant='body2'>
                        { allocation }%
                    </Typography>
                </Box>
                <Box sx={{ width: '100%', ml: 1 }}>
                    <BorderLinearProgress variant='determinate' value={allocation} />
                </Box>
            </React.Fragment>
        </ListItem>
    )
}