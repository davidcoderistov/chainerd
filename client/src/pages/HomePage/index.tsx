import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { keystoreActions } from '../../slices/keystore'
import { getKeystore } from '../../selectors/keystore'
import { getIsSnackbarOpen, getIsSnackbarError, getSnackbarMessage } from '../../selectors/misc'
import { Box } from '@mui/material'
import Dashboard from '../../components/Dashboard'
import AccountsPage from '../AccountsPage'
import CreateWalletModal from '../../components/CreateWalletModal'
import RestoreWalletModal from '../../components/RestoreWalletModal'
import SendTransactionModal from '../../components/SendTransactionModal'
import CloseWalletModal from '../../components/CloseWalletModal'
import Snackbar from '../../components/Snackbar'
import { getCurrentSerializedKeystore } from '../../localStorage'


export default function HomePage () {

    const dispatch = useDispatch()

    const keystore = useSelector(getKeystore)

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
        setSendTransactionModalKey(sendTransactionModalKey + 1)
        setIsSendTransactionModalOpen(true)
    }

    const closeSendTransactionModal = () => {
        setIsSendTransactionModalOpen(false)
    }

    const [isCloseWalletModalOpen, setIsCloseWalletModalOpen] = useState<boolean>(false)
    const [closeWalletModalKey, setCloseWalletModalKey] = useState<number>(9999)

    const openCloseWalletModal = () => {
        setCloseWalletModalKey(closeWalletModalKey + 1)
        setIsCloseWalletModalOpen(true)
    }

    const closeCloseWalletModal = () => {
        setIsCloseWalletModalOpen(false)
    }

    const handleCloseWallet = () => {
        dispatch(keystoreActions.destroy())
        closeCloseWalletModal()
    }

    const snackbarOpen = useSelector(getIsSnackbarOpen)
    const snackbarError = useSelector(getIsSnackbarError)
    const snackbarMessage = useSelector(getSnackbarMessage)

    return (
        <Box>
            <Dashboard
                walletExists={!!keystore}
                onCreateWallet={openCreateWalletModal}
                onRestoreWallet={openRestoreWalletModal}
                onSendTransaction={openSendTransactionModal}
                onCloseWallet={openCloseWalletModal}
            >
                <AccountsPage />
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
                onClose={closeSendTransactionModal}
                onConfirm={closeSendTransactionModal} />
            <CloseWalletModal
                key={closeWalletModalKey}
                open={isCloseWalletModalOpen}
                onCloseModal={closeCloseWalletModal}
                onCloseWallet={handleCloseWallet} />
            <Snackbar
                isOpen={snackbarOpen}
                error={snackbarError}
                message={snackbarMessage} />
        </Box>
    )
}