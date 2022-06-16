import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { createWallet } from '../../slices/keystore'
import { Box } from '@mui/material'
import AppToolbar from '../../components/AppToolbar'
import store from 'store'




export default function HomePage () {

    const dispatch = useDispatch()

    const keystore = useMemo(() => store.get('keystore'), [])

    useEffect(() => {
        if (keystore) {
            dispatch(createWallet.load({ keystore }))
        }
    }, [keystore])

    return (
        <Box>
            <AppToolbar
                walletExists={!!keystore}
                onCreateWallet={() => console.log('onCreateWallet()')}
                onRestoreWallet={() => console.log('onRestoreWallet()')}
                onSendTransaction={() => console.log('onSendTransaction()')}
                onCloseWallet={() => console.log('onCloseWallet()')} />
        </Box>
    )
}