import React, { useContext } from 'react'
import { ThemeContext } from '../../config'
import { Box, ListItemIcon, Typography, styled } from '@mui/material'
import { BarChartOutlined, AccountBalanceWalletOutlined, ArrowDownwardOutlined, DeleteOutline } from '@mui/icons-material'


const Container = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
})

export interface NavItemProps {
    active: boolean
    hovered: boolean
    type: 'portfolio' | 'accounts' | 'send' | 'delete'
    name: string
}

export default function NavItem ({ active, hovered, type, name }: NavItemProps) {

    const { theme } = useContext(ThemeContext)

    return (
        <Container sx={{ backgroundColor: active ? theme.menu.link.background.active :
                hovered ? theme.menu.link.background.hovered : theme.menu.link.background.main }}>
            <ListItemIcon sx={{ minWidth: '40px' }}>
                { type === 'portfolio' && (
                    <BarChartOutlined sx={{ color: active || hovered ? theme.menu.link.icon.active : theme.menu.link.icon.main }} />
                )}
                { type === 'accounts' && (
                    <AccountBalanceWalletOutlined sx={{ color: active || hovered ? theme.menu.link.icon.active : theme.menu.link.icon.main }} />
                )}
                { type === 'send' && (
                    <ArrowDownwardOutlined sx={{ color: active || hovered ? theme.menu.link.icon.active : theme.menu.link.icon.main, transform: 'rotate(180deg)' }} />
                )}
                { type === 'delete' && (
                    <DeleteOutline sx={{ color: active || hovered ? theme.menu.link.icon.active : theme.menu.link.icon.main }}/>
                )}
            </ListItemIcon>
            <Typography noWrap variant='body1' marginY='4px' sx={{ color: active ? theme.menu.link.text.active : theme.menu.link.text.main }}>
                { name }
            </Typography>
        </Container>
    )
}