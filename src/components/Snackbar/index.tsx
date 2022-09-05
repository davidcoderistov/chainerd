import React, { useEffect }  from 'react'
import { Snackbar as SnackbarMUI, Alert } from '@mui/material'

export interface SnackbarMessage {
    message: string
    key: number
}

export interface State {
    open: boolean
    snackPack: readonly SnackbarMessage[]
    messageInfo?: SnackbarMessage
}

export interface SnackbarProps {
    error: boolean
    message: string
    isOpen: boolean
}


export default function Snackbar (props: SnackbarProps) {
    const { error, message, isOpen } = props

    const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([])
    const [open, setOpen] = React.useState(false)
    const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(
        undefined,
    )

    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...snackPack[0] })
            setSnackPack((prev) => prev.slice(1))
            setOpen(true)
        } else if (snackPack.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false)
        }
    }, [snackPack, messageInfo, open])

    useEffect(() => {
        if (isOpen) {
            setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }])
        }
    }, [isOpen])

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }

    const handleExited = () => {
        setMessageInfo(undefined)
    }

    return (
        <SnackbarMUI
            key={messageInfo ? messageInfo.key : undefined}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                sx={{ width: '100%' }}
                severity={error ? 'error' : 'success'}
                onClose={handleClose}>
                { message }
            </Alert>
        </SnackbarMUI>
    )
}