import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getAddresses } from '../../selectors/keystore'
import { Button, Typography, styled } from '@mui/material'
import AccountsList, { AccountsListProps } from '../../components/AccountsList'
import { Add } from '@mui/icons-material'

const AccountsToolbar = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})


export default function AccountsPage () {

    const storeAddresses = useSelector(getAddresses)

    const [searchText, setSearchText] = useState<string>('')

    const handleOnChangeSearchText = (searchText: string) => {
        setSearchText(searchText)
    }

    const handleOnChangeSortBy = (sortBy: number) => {

    }

    const [addresses, setAddresses] = useState<AccountsListProps['addresses']>([])

    useEffect(() => {
        setAddresses(storeAddresses.map(address => ({
            address,
            ethAmount: 0.3327,
            fiatAmount: 359.36,
        })))
    }, [storeAddresses])

    const handleOnEdit = (address: string) => {

    }

    const handleOnSend = (address: string) => {

    }

    return (
        <React.Fragment>
            <AccountsToolbar sx={{ mb: 5 }}>
                <Typography variant='h5' component='div'>
                    Accounts
                </Typography>
                <Button variant='contained' startIcon={<Add />} sx={{ textTransform: 'none' }}>
                    Add account
                </Button>
            </AccountsToolbar>
            <AccountsList
                addresses={addresses}
                onEdit={handleOnEdit}
                onSend={handleOnSend}
                searchText={searchText}
                onChangeSearchText={handleOnChangeSearchText}
                onChangeSortBy={handleOnChangeSortBy} />
        </React.Fragment>
    )
}