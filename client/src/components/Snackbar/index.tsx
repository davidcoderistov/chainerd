import React  from 'react'
import { Snackbar as SnackbarMUI, Alert, SnackbarProps as SnackbarMUIProps } from '@mui/material'


interface SnackbarProps {
    error: boolean,
    message: string,
    onClose: () => void,
}

export default function Snackbar (props: SnackbarMUIProps & SnackbarProps) {
    const { error, message, onClose, ...rest } = props
    return (
        <SnackbarMUI
            {...rest}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={onClose}>
            <Alert
                sx={{ width: '100%' }}
                severity={error ? 'error' : 'success'}
                onClose={onClose}>
                { message }
            </Alert>
        </SnackbarMUI>
    )
}