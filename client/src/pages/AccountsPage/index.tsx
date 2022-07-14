import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addressActions } from '../../slices/address'
import {
    getAddresses,
    getLoading,
    isDeleteAddressSuccess,
    isEditAddressSuccess,
    isGenerateAddressSuccess
} from '../../selectors/address'
import { Button, Typography, styled } from '@mui/material'
import AccountsList, { AccountsListProps } from '../../components/AccountsList'
import ConfirmPasswordModal from '../../components/ConfirmPasswordModal'
import EditAccountModal from '../../components/EditAccountModal'
import { Add } from '@mui/icons-material'
import _orderBy from 'lodash/orderBy'

const AccountsToolbar = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

export default function AccountsPage () {

    const dispatch = useDispatch()

    const storeAddresses = useSelector(getAddresses)
    const accountCreated = useSelector(isGenerateAddressSuccess)
    const accountEdited = useSelector(isEditAddressSuccess)
    const accountDeleted = useSelector(isDeleteAddressSuccess)
    const loading = useSelector(getLoading)

    const [searchText, setSearchText] = useState<string>('')

    const handleOnChangeSearchText = (searchText: string) => {
        setSearchText(searchText)
    }

    const [isConfirmPasswordModalOpen, setConfirmPasswordModalOpen] = useState<boolean>(false)
    const [confirmPasswordModalKey, setConfirmPasswordModalKey] = useState<number>(9999)

    const handleCloseConfirmPasswordModal = () => {
        setConfirmPasswordModalOpen(false)
    }

    const handleAddAccount = (password: string) => {
        dispatch(addressActions.generate({ password }))
    }

    useEffect(() => {
        if (accountCreated) {
            setConfirmPasswordModalOpen(false)
        }
    }, [accountCreated])

    const [sortBy, setSortBy] = useState<number>(0)

    const handleOnChangeSortBy = (sortBy: number) => {
        setSortBy(sortBy)
    }

    const [addresses, setAddresses] = useState<AccountsListProps['addresses']>([])

    const filteredAddresses = useMemo(() => {
        let filtered = Array.from(addresses)
        if (searchText.trim().length > 0) {
            filtered = addresses.filter(({ address}) => {
                return address.name.includes(searchText) || (address.alias && address.alias.includes(searchText))
            })
        }
        if (sortBy > 1) {
            return _orderBy(filtered, ['address.alias', 'address.name'], [sortBy > 2 ? 'desc' : 'asc', 'desc'])
        }
        return _orderBy(filtered, 'ethAmount', sortBy > 0 ? 'asc' : 'desc')
    }, [searchText, sortBy, addresses])

    useEffect(() => {
        setAddresses(storeAddresses.map(({ address, alias }) => ({
            address: {
                name: address,
                alias,
            },
            ethAmount: 0.3327,
            fiatAmount: 359.36,
        })))
    }, [storeAddresses])

    const handleOpenConfirmPasswordModal = () => {
        setConfirmPasswordModalKey(confirmPasswordModalKey + 1)
        setConfirmPasswordModalOpen(true)
    }

    const [selectedAddress, setSelectedAddress] = useState<{ name: string, alias: string | null } | null>(null)
    const [editedAlias, setEditedAlias] = useState<string>('')

    const handleChangeEditedAlias = (alias: string) => {
        setEditedAlias(alias)
    }

    const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState<boolean>(false)
    const [editAccountModalKey, setEditAccountModalKey] = useState<number>(1111)

    const handleCloseEditAccountModal = () => {
        setIsEditAccountModalOpen(false)
    }

    const handleOnEdit = (address: { name: string, alias: string | null }) => {
        setSelectedAddress(address)
        setEditedAlias(address.alias ? address.alias : '')
        setEditAccountModalKey(editAccountModalKey + 1)
        setIsEditAccountModalOpen(true)
    }

    const handleDeleteAccount = () => {
        dispatch(addressActions.delete({ address: selectedAddress ? selectedAddress.name : ''}))
    }

    useEffect(() => {
        if (accountDeleted) {
            setIsEditAccountModalOpen(false)
        }
    }, [accountDeleted])

    const handleEditAccount = () => {
        dispatch(addressActions.edit({
            address: selectedAddress ? selectedAddress.name : '',
            alias: editedAlias,
        }))
    }

    useEffect(() => {
        if (accountEdited) {
            setIsEditAccountModalOpen(false)
        }
    }, [accountEdited])

    const handleOnSend = (address: { name: string, alias: string | null }) => {
        setSelectedAddress(address)
    }

    return (
        <React.Fragment>
            <AccountsToolbar sx={{ mb: 5 }}>
                <Typography variant='h5' component='div'>
                    Accounts
                </Typography>
                <Button variant='contained' startIcon={<Add />} sx={{ textTransform: 'none' }} onClick={handleOpenConfirmPasswordModal}>
                    Add account
                </Button>
            </AccountsToolbar>
            <AccountsList
                addresses={filteredAddresses}
                onEdit={handleOnEdit}
                onSend={handleOnSend}
                searchText={searchText}
                onChangeSearchText={handleOnChangeSearchText}
                onChangeSortBy={handleOnChangeSortBy} />
            <ConfirmPasswordModal
                key={confirmPasswordModalKey}
                open={isConfirmPasswordModalOpen}
                loading={loading}
                onClose={handleCloseConfirmPasswordModal}
                onConfirm={handleAddAccount}
                addNewAddress />
            <EditAccountModal
                key={editAccountModalKey}
                open={isEditAccountModalOpen}
                address={selectedAddress ? selectedAddress : { name: '', alias: null }}
                alias={editedAlias}
                onChangeAlias={handleChangeEditedAlias}
                loading={loading}
                onClose={handleCloseEditAccountModal}
                onDelete={handleDeleteAccount}
                onEdit={handleEditAccount} />
        </React.Fragment>
    )
}