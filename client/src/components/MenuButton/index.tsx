import React, { useState, useCallback, useContext } from 'react'
import { ThemeContext } from '../../config'
import { Button, Menu, MenuItem, ButtonProps } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'


export interface Option {
    id: string
    name: string
}

interface MenuButtonProps {
    children: any
    options: Option[]
    disabled: boolean
    size?: ButtonProps['size']
    sxProps?: any
    onChange: (option: Option, index: number) => void
}

export default function MenuButton ({ children, options, disabled, sxProps, size, onChange }: MenuButtonProps) {

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
        (option: Option, index: number) => {
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