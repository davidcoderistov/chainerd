import React, { useState, useCallback } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'


export interface Option {
    id: string
    name: string
}

interface MenuButtonProps {
    children: any
    options: Option[]
    disabled: boolean
    onChange: (option: Option, index: number) => void
}

export default function MenuButton ({ children, options, disabled, onChange }: MenuButtonProps) {

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
                sx={{ textTransform: 'none' }}
                aria-haspopup='true'
                aria-expanded={ open ? 'true' : undefined }
                disabled={disabled}
                onClick={handleClick}
                endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
                { children }
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
                { options.map((option, index) => (
                    <MenuItem key={index} onClick={() => handleChange(option, index)}>{ option.name }</MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    )
}