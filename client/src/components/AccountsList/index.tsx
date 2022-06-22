import React from 'react'
import { Paper, Typography } from '@mui/material'
import AccountsListBar, { AccountsListBarProps } from './AccountsListBar'
import AccountListItem, { AccountListItemProps } from './AccountListItem'

export interface AccountsItemsProps {
    addresses: Array<{
        address: AccountListItemProps['address'],
        ethAmount: AccountListItemProps['ethAmount'],
        fiatAmount: AccountListItemProps['fiatAmount']
    }>,
    onEdit: AccountListItemProps['onEdit'],
    onSend: AccountListItemProps['onSend'],
}

export type AccountsListProps = AccountsItemsProps & AccountsListBarProps

export default function AccountsList ({ searchText, onChangeSearchText, onChangeSortBy, addresses, onEdit, onSend }: AccountsListProps) {
    return (
        <React.Fragment>
            <AccountsListBar
                searchText={searchText}
                onChangeSearchText={onChangeSearchText}
                onChangeSortBy={onChangeSortBy} />
            { addresses.length > 0 ? (
                addresses.map(({ address, ethAmount, fiatAmount }) => (
                    <AccountListItem
                        key={address}
                        address={address}
                        ethAmount={ethAmount}
                        fiatAmount={fiatAmount}
                        onEdit={onEdit}
                        onSend={onSend} />
                ))
            ) : (
                <Paper elevation={0} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant='body1' sx={{ color: '#909090' }}>
                        No accounts found.
                    </Typography>
                </Paper>
            )}
        </React.Fragment>
    )
}