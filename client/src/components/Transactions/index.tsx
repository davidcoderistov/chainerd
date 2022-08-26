import React, { useContext } from 'react'
import { ThemeContext } from '../../config'
import {
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    tableCellClasses,
    Skeleton,
    Box,
    Paper,
    Typography,
    TablePagination,
    TablePaginationProps,
    Tooltip,
} from '@mui/material'
import OperationIcon from '../OperationIcon'
import _range from 'lodash/range'


const OperationInfo = ({ withdrawal }: { withdrawal: boolean }) => {

    const { theme } = useContext(ThemeContext)

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '10px' }}>
            <Typography noWrap variant='body2'>
                <OperationIcon
                    withdrawal={withdrawal}
                    fontSize={28} />
            </Typography>
            <Typography noWrap variant='body2' fontWeight='bold' color={theme.main.paper.text.primary}>
                { withdrawal ? 'Sent' : 'Received' }
            </Typography>
        </Box>
    )
}

const TableHeaderCell = ({ text, loading }: { text: string, loading: boolean }) => {

    const { theme } = useContext(ThemeContext)

    return (
        <TableCell sx={{ padding: '12px' }}>
            <Typography noWrap variant='body2' color={theme.main.paper.text.secondary}>
                { loading ? <Skeleton variant='rectangular' /> : text }
            </Typography>
        </TableCell>
    )
}

const TableInfoCell = ({ text, short }: { text: string, short?: boolean }) => {

    const { theme } = useContext(ThemeContext)

    return short ? (
        <TableCell sx={{ padding: '12px' }}>
            <Tooltip title={text} placement='top' arrow>
                <Typography noWrap variant='body2' color={theme.main.paper.text.primary}>
                    { `${text.slice(0, 25)}...` }
                </Typography>
            </Tooltip>
        </TableCell>
    ) : (
        <TableCell sx={{ padding: '12px' }}>
            <Typography noWrap variant='body2' color={theme.main.paper.text.primary}>
                { text }
            </Typography>
        </TableCell>
    )
}


export interface Transaction {
    withdrawal: boolean
    hash: string
    from: string
    to: string
    date: string
    amount: string
    value: string
}

export interface TransactionsProps {
    transactions: Transaction[]
    latest: boolean
    loading: boolean
    paginationProps?: TablePaginationProps
    onClickTransaction: (hash: string) => void
}

export default function Transactions ({ transactions, latest, loading, paginationProps, onClickTransaction }: TransactionsProps) {

    const { theme } = useContext(ThemeContext)

    const handleTransactionClick = (hash: string) => {
        onClickTransaction(hash)
    }

    return (
        <Paper elevation={4} sx={{ padding: '15px', backgroundColor: theme.main.paper.background }}>
            <TableContainer>
                <Table sx={{ minWidth: 650, [`& .${tableCellClasses.root}`]: { borderBottom: 'none' } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ padding: '12px' }}>
                                <Typography noWrap variant='body1' sx={{ fontWeight: 'bold' }} color={theme.main.paper.text.primary}>
                                    { loading ? (
                                        <Skeleton variant='rectangular' width={150} />
                                    ) : (
                                        `Latest operations (${paginationProps ? paginationProps.count : transactions.length})`
                                    )}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell
                                text='Operation'
                                loading={loading} />
                            { latest && (
                                <TableHeaderCell
                                    text='From'
                                    loading={loading} />
                            )}
                            <TableHeaderCell
                                text='To'
                                loading={loading} />
                            <TableHeaderCell
                                text='Date'
                                loading={loading} />
                            <TableHeaderCell
                                text='Amount'
                                loading={loading} />
                            <TableHeaderCell
                                text='Value'
                                loading={loading} />
                        </TableRow>
                    </TableHead>
                    { !loading && transactions.length > 0 && (
                        <TableBody>
                            { transactions.map((transaction, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: theme.main.paper.hover, cursor: 'pointer' } }}
                                    onClick={() => handleTransactionClick(transaction.hash)}
                                >
                                    <TableCell sx={{ padding: '12px' }}>
                                        <OperationInfo withdrawal={transaction.withdrawal} />
                                    </TableCell>
                                    { latest && (
                                        <TableInfoCell text={transaction.from} short />
                                    )}
                                    <TableInfoCell text={transaction.to} short={latest} />
                                    <TableInfoCell text={transaction.date} />
                                    <TableInfoCell text={`${ transaction.amount } ETH`} />
                                    <TableInfoCell text={`$${ transaction.value }`} />
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
                ) : transactions.length <= 0 ? (
                    <div style={{ padding: '5px 16px', textAlign: 'center' }}>
                        <Typography noWrap variant='body2' color={theme.main.paper.text.secondary}>
                            No data available
                        </Typography>
                    </div>
                ) : null }
            </TableContainer>
            { (!latest && paginationProps) && (
                <TablePagination
                    sx={{ color: theme.main.paper.text.primary }}
                    component='div'
                    {...paginationProps} />
            )}
        </Paper>
    )
}