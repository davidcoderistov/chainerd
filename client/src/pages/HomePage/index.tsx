import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { keystoreActions } from '../../slices/keystore'
import {
    getKeystore,
    shouldShowSnackbar as shouldShowKeystoreSnackbar,
    isError as isKeystoreError,
    getErrorMessage as getKeystoreErrorMessage,
    getSuccessMessage as getKeystoreSuccessMessage,
    getLoading,
} from '../../selectors/keystore'
import {
    shouldShowSnackbar as shouldShowTransactionSnackbar,
    isError as isTransactionError,
    getErrorMessage as getTransactionErrorMessage,
    getSuccessMessage as getTransactionSuccessMessage,
} from '../../selectors/transaction'
import {
    shouldShowSnackbar as shouldShowAddressSnackbar,
    isError as isAddressError,
    getErrorMessage as getAddressErrorMessage,
    getSuccessMessage as getAddressSuccessMessage,
} from '../../selectors/address'
import { Box, CircularProgress } from '@mui/material'
import Dashboard from '../../components/Dashboard'
import NoWalletPage from '../NoWalletPage'
import PortfolioPage from '../PortfolioPage'
import AccountsPage from '../AccountsPage'
import AccountPage from '../AccountPage'
import CreateWalletModal from '../../components/CreateWalletModal'
import RestoreWalletModal from '../../components/RestoreWalletModal'
import SendTransactionModal from '../../components/SendTransactionModal'
import CloseWalletModal from '../../components/CloseWalletModal'
import Snackbar from '../../components/Snackbar'
import { getCurrentSerializedKeystore } from '../../localStorage'
import { useSnackbarEffect } from '../../hooks'
import { Routes, Route, Navigate } from 'react-router-dom'


export default function HomePage () {

    const dispatch = useDispatch()

    const keystore = useSelector(getKeystore)
    const loading = useSelector(getLoading)
    const walletExists = !!keystore

    useEffect(() => {
        const ks = getCurrentSerializedKeystore()
        if (ks) {
            dispatch(keystoreActions.load({ keystore: ks }))
        }
    }, [])

    const [isCreateWalletModalOpen, setIsCreateWalletModalOpen] = useState<boolean>(false)
    const [createWalletModalKey, setCreateWalletModalKey] = useState<number>(1111)

    const openCreateWalletModal = () => {
        setCreateWalletModalKey(createWalletModalKey + 1)
        setIsCreateWalletModalOpen(true)
    }

    const closeCreateWalletModal = () => {
        setIsCreateWalletModalOpen(false)
    }

    const [isRestoreWalletModalOpen, setIsRestoreWalletModalOpen] = useState<boolean>(false)
    const [restoreWalletModalKey, setRestoreWalletModalKey] = useState<number>(3333)

    const openRestoreWalletModal = () => {
        setRestoreWalletModalKey(restoreWalletModalKey + 1)
        setIsRestoreWalletModalOpen(true)
    }

    const closeRestoreWalletModal = () => {
        setIsRestoreWalletModalOpen(false)
    }

    const [isSendTransactionModalOpen, setIsSendTransactionModalOpen] = useState<boolean>(false)
    const [sendTransactionModalKey, setSendTransactionModalKey] = useState<number>(6666)

    const openSendTransactionModal = () => {
        if (walletExists) {
            setSendTransactionModalKey(sendTransactionModalKey + 1)
            setIsSendTransactionModalOpen(true)
        }
    }

    const closeSendTransactionModal = () => {
        setIsSendTransactionModalOpen(false)
    }

    const [isCloseWalletModalOpen, setIsCloseWalletModalOpen] = useState<boolean>(false)
    const [closeWalletModalKey, setCloseWalletModalKey] = useState<number>(9999)

    const openCloseWalletModal = () => {
        if (walletExists) {
            setCloseWalletModalKey(closeWalletModalKey + 1)
            setIsCloseWalletModalOpen(true)
        }
    }

    const closeCloseWalletModal = () => {
        setIsCloseWalletModalOpen(false)
    }

    const handleCloseWallet = () => {
        dispatch(keystoreActions.destroy())
        closeCloseWalletModal()
    }

    const [keystoreSnackbarOpen, setKeystoreSnackbarOpen] = useState<boolean>(false)
    const [keystoreSnackbarError, setKeystoreSnackbarError] = useState<boolean>(false)
    const [keystoreSnackbarMessage, setKeystoreSnackbarMessage] = useState<string>('')
    const showKeystoreSnackbar = useSelector(shouldShowKeystoreSnackbar)
    const keystoreError = useSelector(isKeystoreError)
    const keystoreErrorMessage = useSelector(getKeystoreErrorMessage)
    const keystoreSuccessMessage = useSelector(getKeystoreSuccessMessage)

    useSnackbarEffect({
        isSnackbarOpen: showKeystoreSnackbar,
        isError: keystoreError,
        errorMessage: keystoreErrorMessage,
        successMessage: keystoreSuccessMessage,
        setSnackbarOpen: setKeystoreSnackbarOpen,
        setSnackbarError: setKeystoreSnackbarError,
        setSnackbarMessage: setKeystoreSnackbarMessage,
    })

    const [transactionSnackbarOpen, setTransactionSnackbarOpen] = useState<boolean>(false)
    const [transactionSnackbarError, setTransactionSnackbarError] = useState<boolean>(false)
    const [transactionSnackbarMessage, setTransactionSnackbarMessage] = useState<string>('')
    const showTransactionSnackbar = useSelector(shouldShowTransactionSnackbar)
    const transactionError = useSelector(isTransactionError)
    const transactionErrorMessage = useSelector(getTransactionErrorMessage)
    const transactionSuccessMessage = useSelector(getTransactionSuccessMessage)

    useSnackbarEffect({
        isSnackbarOpen: showTransactionSnackbar,
        isError: transactionError,
        errorMessage: transactionErrorMessage,
        successMessage: transactionSuccessMessage,
        setSnackbarOpen: setTransactionSnackbarOpen,
        setSnackbarError: setTransactionSnackbarError,
        setSnackbarMessage: setTransactionSnackbarMessage,
    })

    const [addressSnackbarOpen, setAddressSnackbarOpen] = useState<boolean>(false)
    const [addressSnackbarError, setAddressSnackbarError] = useState<boolean>(false)
    const [addressSnackbarMessage, setAddressSnackbarMessage] = useState<string>('')
    const showAddressSnackbar = useSelector(shouldShowAddressSnackbar)
    const addressError = useSelector(isAddressError)
    const addressErrorMessage = useSelector(getAddressErrorMessage)
    const addressSuccessMessage = useSelector(getAddressSuccessMessage)

    useSnackbarEffect({
        isSnackbarOpen: showAddressSnackbar,
        isError: addressError,
        errorMessage: addressErrorMessage,
        successMessage: addressSuccessMessage,
        setSnackbarOpen: setAddressSnackbarOpen,
        setSnackbarError: setAddressSnackbarError,
        setSnackbarMessage: setAddressSnackbarMessage,
    })

    return (
        <Box>
            <Dashboard
                walletExists={walletExists}
                walletLoading={loading}
                onSendTransaction={openSendTransactionModal}
                onCloseWallet={openCloseWalletModal}
            >
                { walletExists ? (
                    <Routes>
                        <Route path='/portfolio' element={
                            <PortfolioPage />
                        } />
                        <Route path='/accounts' element={
                            <AccountsPage />
                        } />
                        <Route path='/accounts/:address' element={
                            <AccountPage />
                        } />
                        <Route path='*' element={
                            <Navigate to='/accounts' replace />
                        } />
                    </Routes>
                ): loading ? (
                    <Routes>
                        <Route path='/' element={
                            <Box display='flex' flexDirection='column' height={550} alignItems='center' justifyContent='center'>
                                <CircularProgress variant='indeterminate' />
                            </Box>
                        } />
                        <Route path='*' element={
                            <Navigate to='/' replace />
                        } />
                    </Routes>
                ) : (
                    <Routes>
                        <Route path='/' element={
                            <NoWalletPage
                                onCreateWallet={openCreateWalletModal}
                                onRestoreWallet={openRestoreWalletModal} />
                        } />
                        <Route path='*' element={
                            <Navigate to='/' replace />
                        } />
                    </Routes>
                )}
            </Dashboard>
            <CreateWalletModal
                key={createWalletModalKey}
                open={isCreateWalletModalOpen}
                onCreateWallet={closeCreateWalletModal}
                onClose={closeCreateWalletModal} />
            <RestoreWalletModal
                key={restoreWalletModalKey}
                open={isRestoreWalletModalOpen}
                onRestoreWallet={closeRestoreWalletModal}
                onClose={closeRestoreWalletModal} />
            <SendTransactionModal
                key={sendTransactionModalKey}
                open={isSendTransactionModalOpen}
                onClose={closeSendTransactionModal} />
            <CloseWalletModal
                key={closeWalletModalKey}
                open={isCloseWalletModalOpen}
                onCloseModal={closeCloseWalletModal}
                onCloseWallet={handleCloseWallet} />
            { keystoreSnackbarOpen && (
                <Snackbar
                    isOpen={keystoreSnackbarOpen}
                    error={keystoreSnackbarError}
                    message={keystoreSnackbarMessage} />
            )}
            { transactionSnackbarOpen && (
                <Snackbar
                    isOpen={transactionSnackbarOpen}
                    error={transactionSnackbarError}
                    message={transactionSnackbarMessage} />
            )}
            { addressSnackbarOpen && (
                <Snackbar
                    isOpen={addressSnackbarOpen}
                    error={addressSnackbarError}
                    message={addressSnackbarMessage} />
            )}
        </Box>
    )
}