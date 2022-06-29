import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { keystoreActions } from '../../slices/keystore'
import {
    getAddresses,
    getLoading,
    isDeleteAddressSuccess,
    isEditAddressSuccess,
    isGenerateAddressSuccess
} from '../../selectors/keystore'
import { Button, Typography, styled } from '@mui/material'
import AccountsList, { AccountsListProps } from '../../components/AccountsList'
import ConfirmPasswordModal from '../../components/ConfirmPasswordModal'
import EditAccountModal from '../../components/EditAccountModal'
import { Add } from '@mui/icons-material'

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
        dispatch(keystoreActions.generateAddress({ password }))
    }

    useEffect(() => {
        if (accountCreated) {
            setConfirmPasswordModalOpen(false)
        }
    }, [accountCreated])

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

    const handleOpenConfirmPasswordModal = () => {
        setConfirmPasswordModalKey(confirmPasswordModalKey + 1)
        setConfirmPasswordModalOpen(true)
    }

    const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

    const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState<boolean>(false)
    const [editAccountModalKey, setEditAccountModalKey] = useState<number>(1111)

    const handleCloseEditAccountModal = () => {
        setIsEditAccountModalOpen(false)
    }

    const handleOnEdit = (address: string) => {
        setSelectedAddress(address)
        setEditAccountModalKey(editAccountModalKey + 1)
        setIsEditAccountModalOpen(true)
    }

    const handleDeleteAccount = () => {
        dispatch(keystoreActions.deleteAddress({
            address: selectedAddress,
        }))
    }

    useEffect(() => {
        if (accountDeleted) {
            setIsEditAccountModalOpen(false)
        }
    }, [accountDeleted])

    const handleEditAccount = (alias: string) => {
        dispatch(keystoreActions.editAddress({
            address: selectedAddress,
            alias,
        }))
    }

    useEffect(() => {
        if (accountEdited) {
            setIsEditAccountModalOpen(false)
        }
    }, [accountEdited])

    const handleOnSend = (address: string) => {
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
                addresses={addresses}
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
                address={selectedAddress ? selectedAddress : ''}
                loading={loading}
                onClose={handleCloseEditAccountModal}
                onDelete={handleDeleteAccount}
                onEdit={handleEditAccount} />
        </React.Fragment>
    )
}