import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createWallet } from '../../slices/keystore'
import { getKeystore } from '../../selectors/keystore'
import { Box } from '@mui/material'
import AppToolbar from '../../components/AppToolbar'
import CreateWalletModal from '../../components/CreateWalletModal'
import RestoreWalletModal from '../../components/RestoreWalletModal'
import SendTransactionModal from '../../components/SendTransactionModal'
import CloseWalletModal from '../../components/CloseWalletModal'
import store from 'store'




export default function HomePage () {

    const dispatch = useDispatch()

    const keystore = useSelector(getKeystore)

    useEffect(() => {
        const keystore = store.get('keystore')
        if (keystore) {
            dispatch(createWallet.load({ keystore }))
        }
    }, [])

    const [isCreateWalletModalOpen, setIsCreateWalletModalOpen] = useState<boolean>(false)

    const openCreateWalletModal = () => {
        setIsCreateWalletModalOpen(true)
    }

    const closeCreateWalletModal = () => {
        setIsCreateWalletModalOpen(false)
    }

    const [isRestoreWalletModalOpen, setIsRestoreWalletModalOpen] = useState<boolean>(false)

    const openRestoreWalletModal = () => {
        setIsRestoreWalletModalOpen(true)
    }

    const closeRestoreWalletModal = () => {
        setIsRestoreWalletModalOpen(false)
    }

    const [isSendTransactionModalOpen, setIsSendTransactionModalOpen] = useState<boolean>(false)

    const openSendTransactionModal = () => {
        setIsSendTransactionModalOpen(true)
    }

    const closeSendTransactionModal = () => {
        setIsSendTransactionModalOpen(false)
    }

    const [isCloseWalletModalOpen, setIsCloseWalletModalOpen] = useState<boolean>(false)

    const openCloseWalletModal = () => {
        setIsCloseWalletModalOpen(true)
    }

    const closeCloseWalletModal = () => {
        setIsCloseWalletModalOpen(false)
    }

    return (
        <Box>
            <AppToolbar
                walletExists={!!keystore}
                onCreateWallet={openCreateWalletModal}
                onRestoreWallet={openRestoreWalletModal}
                onSendTransaction={openSendTransactionModal}
                onCloseWallet={openCloseWalletModal} />
            <CreateWalletModal
                open={isCreateWalletModalOpen}
                onCreateWallet={closeCreateWalletModal}
                onClose={closeCreateWalletModal} />
            <RestoreWalletModal
                open={isRestoreWalletModalOpen}
                onRestoreWallet={closeRestoreWalletModal}
                onClose={closeRestoreWalletModal} />
            <SendTransactionModal
                open={isSendTransactionModalOpen}
                onClose={closeSendTransactionModal}
                onConfirm={closeSendTransactionModal} />
            <CloseWalletModal
                open={isCloseWalletModalOpen}
                onCloseModal={closeCloseWalletModal}
                onCloseWallet={closeCloseWalletModal} />
        </Box>
    )
}