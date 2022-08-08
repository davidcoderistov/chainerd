import React from 'react'
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

    return (
        <Container sx={{ backgroundColor: active ? '#EFF4FE' : hovered ? '#F9F9F9' : '#FFFFFF' }}>
            <ListItemIcon sx={{ minWidth: '40px' }}>
                { type === 'portfolio' && (
                    <BarChartOutlined sx={{ color: active || hovered ? '#1976d2' : '#9f9f9f' }} />
                )}
                { type === 'accounts' && (
                    <AccountBalanceWalletOutlined sx={{ color: active || hovered ? '#1976d2' : '#9f9f9f' }} />
                )}
                { type === 'send' && (
                    <ArrowDownwardOutlined sx={{ color: active || hovered ? '#1976d2' : '#9f9f9f', transform: 'rotate(180deg)' }} />
                )}
                { type === 'delete' && (
                    <DeleteOutline sx={{ color: active || hovered ? '#1976d2' : '#9f9f9f' }}/>
                )}
            </ListItemIcon>
            <Typography noWrap variant='body1' marginY='4px' sx={{ color: active ? '#1976d2' : 'black' }}>
                { name }
            </Typography>
        </Container>
    )
}