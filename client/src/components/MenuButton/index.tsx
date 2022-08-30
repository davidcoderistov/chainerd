import React, { useState, useCallback, useContext } from 'react'
import { ThemeContext } from '../../config'
import { Button, Menu, MenuItem, ButtonProps } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'


export interface Option<T, U extends React.ReactNode> {
    id: T
    name: U
}

interface MenuButtonProps<T,U extends React.ReactNode> {
    children: any
    options: Option<T, U>[]
    disabled: boolean
    size?: ButtonProps['size']
    sxProps?: any
    onChange: (option: Option<T, U>, index: number) => void
}

export default function MenuButton<T,U extends React.ReactNode> ({ children, options, disabled, sxProps, size, onChange }: MenuButtonProps<T, U>) {

    const { theme } = useContext(ThemeContext)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleChange = useCallback(
        (option: Option<T,U>, index: number) => {
            onChange(option, index)
            handleClose()
        },
        [onChange]
    )

    return (
        <React.Fragment>
            <Button
                sx={{ textTransform: 'none', color: theme.main.button, ...sxProps && { ...sxProps }}}
                aria-haspopup='true'
                aria-expanded={ open ? 'true' : undefined }
                disabled={disabled}
                onClick={handleClick}
                endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                {...size && { size }}
            >
                { children }
            </Button>
            <Menu
                sx={{ '.MuiMenu-paper': { backgroundColor: theme.main.menu.background, color: theme.main.menu.text }}}
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
                { options.map((option, index) => (
                    <MenuItem
                        sx={{ '&:hover': { backgroundColor: theme.main.menu.hover }}}
                        key={index}
                        onClick={() => handleChange(option, index)}>
                        { option.name }
                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    )
}