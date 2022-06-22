import React, { useState, useCallback } from 'react'
import { Paper, Grid, Button, IconButton, Menu, MenuItem, InputAdornment, styled } from '@mui/material'
import { Search, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import TextInput from '../TextInput'

const GridItem = styled(Grid)({
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '16px'
})

const sortByOptions = [
    'Highest Balance',
    'Lowest Balance',
    'Name A-Z',
    'Name Z-A',
]

interface AccountsListBarProps {
    searchText: string,
    onChangeSearchText: (searchText: string) => void,
    onChangeSortBy: (option: string) => void,
}

export default function AccountsListBar ({ searchText, onChangeSearchText, onChangeSortBy } : AccountsListBarProps) {

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
        (option: string) => {
            setSelectedItem(option)
            onChangeSortBy(option)
            handleClose()
        },
        [onChangeSortBy]
    )

    return (
        <Paper elevation={4} sx={{ mb: 4, px: 3 }}>
            <Grid container spacing={2}>
                <GridItem item xs>
                    <TextInput
                        value={searchText}
                        onChange={handleOnChangeSearchText}
                        variant='standard'
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <IconButton
                                        aria-label='toggle password visibility'
                                        edge='start'>
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }} />
                </GridItem>
                <GridItem item xs='auto'>
                    <div>
                        <Button
                            sx={{ textTransform: 'none' }}
                            aria-haspopup='true'
                            aria-expanded={ open ? 'true' : undefined }
                            onClick={handleClick}
                            endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        >
                            <span style={{ color: '#909090', marginRight: '5px' }}>Sort by</span>
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
                                <MenuItem key={index} onClick={() => handleOnChangeSortBy(option)}>{ option }</MenuItem>
                            ))}
                        </Menu>
                    </div>
                </GridItem>
            </Grid>
        </Paper>
    )
}