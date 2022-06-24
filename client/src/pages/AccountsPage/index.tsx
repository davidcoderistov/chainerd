import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { keystoreActions } from '../../slices/keystore'
import { SUCCESS_CODES } from '../../sagas/keystore'
import { getAddresses, getError, getErrorCode, getSuccessCode, getLoading } from '../../selectors/keystore'
import { Button, Typography, styled } from '@mui/material'
import AccountsList, { AccountsListProps } from '../../components/AccountsList'
import ConfirmPasswordModal from '../../components/ConfirmPasswordModal'
import Snackbar from '../../components/Snackbar'
import { Add } from '@mui/icons-material'

const AccountsToolbar = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})


export default function AccountsPage () {

    const dispatch = useDispatch()

    const storeAddresses = useSelector(getAddresses)
    const errorMessage = useSelector(getError)
    const errorCode = useSelector(getErrorCode)
    const successCode = useSelector(getSuccessCode)
    const loading = useSelector(getLoading)

    const [searchText, setSearchText] = useState<string>('')

    const handleOnChangeSearchText = (searchText: string) => {
        setSearchText(searchText)
    }

    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [errorSnackbarMessage, setErrorSnackbarMessage] = useState<boolean>(false)

    const handleCloseSnackbar = () => {
        setShowSnackbar(false)
    }

    const [isConfirmPasswordModalOpen, setConfirmPasswordModalOpen] = useState<boolean>(false)
    const [confirmPasswordModalKey, setConfirmPasswordModalKey] = useState<number>(9999)

    const handleCloseModal = () => {
        setConfirmPasswordModalOpen(false)
    }

    const handleConfirmModal = (password: string) => {
        dispatch(keystoreActions.generateAddress({ password }))
    }

    useEffect(() => {
        if (errorCode === 5 && errorMessage) {
            setShowSnackbar(true)
            setSnackbarMessage(errorMessage)
            setErrorSnackbarMessage(true)
        }
        if (errorMessage) {
            dispatch(keystoreActions.clearError())
        }
    }, [errorMessage, errorCode])

    useEffect(() => {
        if (successCode === SUCCESS_CODES.GENERATE_ADDRESS) {
            setShowSnackbar(true)
            setSnackbarMessage('Account successfully generated')
            setErrorSnackbarMessage(false)
            dispatch(keystoreActions.clearSuccess())
            setConfirmPasswordModalOpen(false)
        }
    }, [successCode])

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

    const handleAddAccount = () => {
        setConfirmPasswordModalKey(confirmPasswordModalKey + 1)
        setConfirmPasswordModalOpen(true)
    }

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
                <Button variant='contained' startIcon={<Add />} sx={{ textTransform: 'none' }} onClick={handleAddAccount}>
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
                onClose={handleCloseModal}
                onConfirm={handleConfirmModal}
                addNewAddress />
            <Snackbar
                open={showSnackbar}
                error={errorSnackbarMessage}
                message={snackbarMessage}
                onClose={handleCloseSnackbar} />
        </React.Fragment>
    )
}