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
import { Paper, Grid, Button, IconButton, Typography } from '@mui/material'
import AccountsAction from './AccountsAction'
import { Add, Send, Edit } from '@mui/icons-material'
import _range from 'lodash/range'


export interface Account {
    alias: string
    address: string
    amount: string
    value: string
}

export interface AccountsProps {
    accounts: Account[]
    loading: boolean
    onAddAccount: () => void
    searchText: string
    onChangeSearchText: (searchText: string) => void
    onChangeSortBy: (index: number) => void
    onEditAccount: (address: string) => void
    onSendTransaction: (address: string) => void
}

export default function Accounts ({ accounts, loading, onAddAccount, searchText, onChangeSearchText, onChangeSortBy, onEditAccount, onSendTransaction, }: AccountsProps) {

    return (
        <Paper elevation={4} sx={{ padding: '15px' }}>
            <TableContainer>
                <Grid container justifyContent='space-between' sx={{ padding: '16px', minWidth: 750 }}>
                    <Typography noWrap variant='body1' sx={{ fontWeight: 'bold' }}>
                        { loading ? (
                            <Skeleton variant='rectangular' width={150} />
                        ) : (
                            `Accounts (${ accounts.length })`
                        )}
                    </Typography>
                    <Button variant='contained' startIcon={<Add />} sx={{ textTransform: 'none' }} disabled={loading} onClick={onAddAccount}>
                        Add account
                    </Button>
                </Grid>
                <AccountsAction
                    searchText={searchText}
                    loading={loading}
                    onChangeSearchText={onChangeSearchText}
                    onChangeSortBy={onChangeSortBy} />
                <Table sx={{ minWidth: 750, [`& .${tableCellClasses.root}`]: { borderBottom: 'none' } }}>
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
                            <TableCell>
                                <Typography noWrap variant='body2' color='text.secondary'>
                                    { loading ? <Skeleton variant='rectangular' /> : 'Actions' }
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    { !loading && accounts.length > 0 && (
                        <TableBody>
                            { accounts.map((account, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <Typography noWrap variant='body2'>
                                            { account.alias }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography noWrap variant='body2'>
                                            { account.address }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography noWrap variant='body2'>
                                            { account.amount } ETH
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography noWrap variant='body2'>
                                            ${ account.value }
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>
                                        <IconButton color='primary' aria-label='edit' component='div' onClick={() => onEditAccount(account.address)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color='primary' aria-label='send' component='div' onClick={() => onSendTransaction(account.address)}>
                                            <Send />
                                        </IconButton>
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
                ) : accounts.length <= 0 ? (
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