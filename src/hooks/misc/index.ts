import { useEffect, useRef } from 'react'


export const useDidMountEffect = (callback: () => any, deps: Array<any>) => {
    const didMount = useRef(false)

    useEffect(() => {
        if (didMount.current) {
            callback()
        } else {
            didMount.current = true
        }
    }, deps)
}

export const useSnackbarEffect = ({ isSnackbarOpen, isError, errorMessage, successMessage, setSnackbarOpen, setSnackbarError, setSnackbarMessage }: {
    isSnackbarOpen: boolean,
    isError: boolean,
    errorMessage: string | null,
    successMessage: string | null
    setSnackbarOpen: (snackbarOpen: boolean) => void
    setSnackbarError: (snackbarError: boolean) => void
    setSnackbarMessage: (snackbarMessage: string) => void
}) => {
    useEffect(() => {
        if (isSnackbarOpen) {
            setSnackbarOpen(true)
            const error = isError
            setSnackbarError(error)
            setSnackbarMessage(error ? errorMessage ? errorMessage : '' : successMessage ? successMessage : '')
        } else {
            setSnackbarOpen(false)
            setSnackbarError(false)
            setSnackbarMessage('')
        }
    }, [isSnackbarOpen])
}