import React from 'react'
import { DialogTitle as DialogTitleMUI, Box, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'


export interface DialogTitleProps {
    children: any
    onClose: () => void
}

export default function DialogTitle ({ children, onClose }: DialogTitleProps) {

    return (
        <DialogTitleMUI sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '0 0 100%' }}>
                { children }
            </Box>
            <Box sx={{ position: 'absolute' }}>
                <IconButton
                    aria-label='close'
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </Box>
        </DialogTitleMUI>
    )
}