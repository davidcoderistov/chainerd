import React, { useState, useCallback, useContext } from 'react'
import { ThemeContext } from '../../config'
import { Box, Grid, IconButton, InputAdornment } from '@mui/material'
import { Search } from '@mui/icons-material'
import TextInput from '../TextInput'
import MenuButton, { Option } from '../MenuButton'


const sortByOptions = [
    {
        id: 'balanceDesc',
        name: 'Highest Balance'
    },
    {
        id: 'balanceAsc',
        name: 'Lowest Balance'
    },
    {
        id: 'nameAsc',
        name: 'Name A-Z'
    },
    {
        id: 'nameDesc',
        name: 'Name Z-A'
    },
]

export interface AccountsActionProps {
    searchText: string
    loading: boolean
    onChangeSearchText: (searchText: string) => void
    onChangeSortBy: (index: number) => void
}

export default function AccountsAction ({ searchText, loading, onChangeSearchText, onChangeSortBy } : AccountsActionProps) {

    const { theme } = useContext(ThemeContext)

    const [selectedItem, setSelectedItem] = useState<string>(sortByOptions[0].name)

    const handleOnChangeSearchText = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeSearchText(event.target.value)
        },
        [onChangeSearchText]
    )

    const handleOnChangeSortBy = useCallback(
        (option: Option, index: number) => {
            setSelectedItem(option.name)
            onChangeSortBy(index)
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
                <MenuButton
                    options={sortByOptions}
                    disabled={loading}
                    onChange={handleOnChangeSortBy}>
                        <React.Fragment>
                            <span style={{ color: theme.main.paper.text.secondary, marginRight: '5px' }}>Sort by</span>
                            <span>{ selectedItem }</span>
                        </React.Fragment>
                </MenuButton>
            </Box>
        </Grid>
    )
}