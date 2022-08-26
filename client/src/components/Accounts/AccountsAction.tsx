import React, { useState, useCallback, useContext } from 'react'
import { ThemeContext } from '../../config'
import { Box, Grid, Button, IconButton, Menu, MenuItem, InputAdornment } from '@mui/material'
import { Search, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import TextInput from '../TextInput'


const sortByOptions = [
    'Highest Balance',
    'Lowest Balance',
    'Name A-Z',
    'Name Z-A',
]

export interface AccountsActionProps {
    searchText: string
    loading: boolean
    onChangeSearchText: (searchText: string) => void
    onChangeSortBy: (index: number) => void
}

export default function AccountsAction ({ searchText, loading, onChangeSearchText, onChangeSortBy } : AccountsActionProps) {

    const { theme } = useContext(ThemeContext)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const [selectedItem, setSelectedItem] = useState<string>(sortByOptions[0])

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleOnChangeSearchText = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeSearchText(event.target.value)
        },
        [onChangeSearchText]
    )

    const handleOnChangeSortBy = useCallback(
        (option: string, index: number) => {
            setSelectedItem(option)
            onChangeSortBy(index)
            handleClose()
        },
        [onChangeSortBy]
    )

    return (
        <Grid container sx={{ padding: '8px 16px', minWidth: 750 }}>
            <Box display='flex' flex='1 1 auto'>
                <TextInput
                    sx={{ input: { color: theme.main.paper.text.primary }}}
                    value={searchText}
                    onChange={handleOnChangeSearchText}
                    variant='standard'
                    fullWidth
                    disabled={loading}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <IconButton
                                    sx={{ color: theme.main.paper.icon }}
                                    aria-label='toggle password visibility'
                                    edge='start'>
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        )
                    }} />
            </Box>
            <Box display='flex' flex='0 0 250px' justifyContent='end'>
                <Button
                    sx={{ textTransform: 'none' }}
                    aria-haspopup='true'
                    aria-expanded={ open ? 'true' : undefined }
                    disabled={loading}
                    onClick={handleClick}
                    endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                >
                    <span style={{ color: theme.main.paper.text.secondary, marginRight: '5px' }}>Sort by</span>
                    <span>{ selectedItem }</span>
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    { sortByOptions.map((option, index) => (
                        <MenuItem key={index} onClick={() => handleOnChangeSortBy(option, index)}>{ option }</MenuItem>
                    ))}
                </Menu>
            </Box>
        </Grid>
    )
}