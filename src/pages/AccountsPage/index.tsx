import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addressActions } from '../../slices/address'
import { portfolioActions } from '../../slices/portfolio'
import {
    getAddresses,
    getLoading,
    getAddressesLoading,
    isDeleteAddressSuccess,
    isEditAddressSuccess,
    isGenerateAddressSuccess
} from '../../selectors/address'
import Accounts, { Account } from '../../components/Accounts'
import ConfirmPasswordModal from '../../components/ConfirmPasswordModal'
import EditAccountModal from '../../components/EditAccountModal'
import _orderBy from 'lodash/orderBy'


interface AccountsPageProps {
    onSendTransaction: (address: string) => void
}

export default function AccountsPage ({ onSendTransaction }: AccountsPageProps) {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const storeAddresses = useSelector(getAddresses)
    const accountCreated = useSelector(isGenerateAddressSuccess)
    const accountEdited = useSelector(isEditAddressSuccess)
    const accountDeleted = useSelector(isDeleteAddressSuccess)
    const loading = useSelector(getLoading)
    const addressesLoading = useSelector(getAddressesLoading)

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

    const [addresses, setAddresses] = useState<Account[]>([])

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
        setAddresses(storeAddresses.map(({ address, alias, ethAmount, fiatAmount }) => ({
            address: {
                name: address,
                alias,
            },
            ethAmount,
            fiatAmount,
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

    const handleOnClick = (address: { name: string, alias: string | null }) => {
        navigate(`/accounts/${address.name}`)
    }

    const handleDeleteAccount = () => {
        dispatch(addressActions.delete({ address: selectedAddress ? selectedAddress.name : ''}))
    }

    useEffect(() => {
        if (accountDeleted) {
            setIsEditAccountModalOpen(false)
            dispatch(portfolioActions.fetchLatestTransactions({
                addresses: storeAddresses.map(address => address.address),
            }))
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
        onSendTransaction(address.alias ? address.alias : address.name)
    }

    return (
        <React.Fragment>
            <Accounts
                accounts={filteredAddresses}
                loading={addressesLoading}
                onAddAccount={handleOpenConfirmPasswordModal}
                searchText={searchText}
                onChangeSearchText={handleOnChangeSearchText}
                onChangeSortBy={handleOnChangeSortBy}
                onEditAccount={handleOnEdit}
                onClickAccount={handleOnClick}
                onSendTransaction={handleOnSend} />
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