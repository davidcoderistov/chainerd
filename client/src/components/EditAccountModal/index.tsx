import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Grid, IconButton, styled } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import TextInput from '../TextInput'
import { Close } from '@mui/icons-material'

const DialogTitleStyled = styled(DialogTitle)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

interface EditAccountModalProps {
    open: boolean,
    address: string,
    loading?: boolean,
    onClose: () => void,
    onDelete: () => void,
    onEdit: (alias: string) => void,
}

export default function EditAccountModal ({ open, address, loading, onClose, onDelete, onEdit } : EditAccountModalProps) {
    const [alias, setAlias] = useState<string>('')

    const handleChangeAlias = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAlias(event.target.value)
    }

    const handleEdit = () => {
        onEdit(alias)
    }

    return (
        <Dialog open={open} fullWidth={true} maxWidth='xs' scroll='paper'>
            <DialogTitleStyled>
                <div/>
                <div>Edit Account</div>
                <IconButton
                    aria-label='close'
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitleStyled>
            <DialogContent dividers={true}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextInput
                            inputLabel='Account alias'
                            placeholder='Enter account alias'
                            value={alias}
                            onChange={handleChangeAlias}
                            sx={{ mb: 2 }}
                            helperText={`Account alias for ${address}`}
                            fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <LoadingButton sx={{ mr: 1 }} color='error' loading={loading} onClick={onDelete}>
                    Delete
                </LoadingButton>
                <LoadingButton sx={{ mr: 1 }} loading={loading} onClick={handleEdit} disabled={alias.trim().length <= 0}>
                    Edit
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}