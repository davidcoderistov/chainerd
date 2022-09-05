import React, { useCallback } from 'react'
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
    address: { name: string, alias: string | null },
    alias: string,
    onChangeAlias: (alias: string) => void,
    loading?: boolean,
    onClose: () => void,
    onDelete: () => void,
    onEdit: () => void,
}

export default function EditAccountModal ({ open, alias, onChangeAlias, address, loading, onClose, onDelete, onEdit } : EditAccountModalProps) {

    const handleChangeAlias = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeAlias(event.target.value)
        },
        [onChangeAlias]
    )

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
                            helperText={`Account alias for ${address.name}`}
                            fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <LoadingButton sx={{ mr: 1 }} color='error' loading={loading} onClick={onDelete}>
                    Delete
                </LoadingButton>
                <LoadingButton sx={{ mr: 1 }} loading={loading} onClick={onEdit} disabled={alias.trim().length <= 0}>
                    Edit
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}