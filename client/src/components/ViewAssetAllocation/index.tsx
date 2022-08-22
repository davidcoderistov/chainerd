import React from 'react'
import {
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    tableCellClasses,
    Skeleton
} from '@mui/material'
import { Paper, Box, Typography, styled } from '@mui/material'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import _range from 'lodash/range'

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

interface AssetAllocationItem {
    account: string
    address: string
    amount: string
    value: string
    allocation: number
}

export interface ViewAssetAllocationProps {
    items: AssetAllocationItem[]
    loading: boolean
}

export default function ViewAssetAllocation ({ items, loading }: ViewAssetAllocationProps) {

    return (
        <Paper elevation={4} sx={{ padding: '15px' }}>
            <TableContainer>
                <Table sx={{ minWidth: 650, [`& .${tableCellClasses.root}`]: { borderBottom: 'none' } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography noWrap variant='body1' sx={{ fontWeight: 'bold' }}>
                                    { loading ? (
                                        <Skeleton variant='rectangular' width={150} />
                                    ) : (
                                        `Asset Allocation (${ items.length })`
                                    )}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography noWrap variant='body2' color='text.secondary'>
                                    { loading ? <Skeleton variant='rectangular' /> : 'Account' }
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography noWrap variant='body2' color='text.secondary'>
                                    { loading ? <Skeleton variant='rectangular' /> : 'Address' }
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography noWrap variant='body2' color='text.secondary'>
                                    { loading ? <Skeleton variant='rectangular' /> : 'Amount' }
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography noWrap variant='body2' color='text.secondary'>
                                    { loading ? <Skeleton variant='rectangular' /> : 'Value' }
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '30%', minWidth: 250 }}>
                                <Typography noWrap variant='body2' color='text.secondary'>
                                    { loading ? <Skeleton variant='rectangular' /> : 'Allocation' }
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    { !loading && items.length > 0 && (
                        <TableBody>
                            { items.map((item, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <Typography noWrap variant='body2'>
                                            { item.account }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography noWrap variant='body2'>
                                            { item.address }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography noWrap variant='body2'>
                                            { item.amount } ETH
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography noWrap variant='body2'>
                                            ${ item.value }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ minWidth: 50, textAlign: 'end' }}>
                                                <Typography noWrap variant='body2'>
                                                    { item.allocation }%
                                                </Typography>
                                            </Box>
                                            <Box sx={{ width: '100%', ml: 1 }}>
                                                <BorderLinearProgress variant='determinate' value={item.allocation} />
                                            </Box>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    )}
                </Table>
                { loading ? (
                    _range(5).map(index => (
                        <div style={{ padding: '5px 16px'}} key={index}>
                            <Skeleton variant='rectangular' height={35}/>
                        </div>
                    ))
                ) : items.length <= 0 ? (
                    <div style={{ padding: '5px 16px', textAlign: 'center' }}>
                        <Typography noWrap variant='body2' color='text.secondary'>
                            No data available
                        </Typography>
                    </div>
                ) : null }
            </TableContainer>
        </Paper>
    )
}