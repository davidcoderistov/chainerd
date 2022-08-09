import React, { useState } from 'react'
import { Container, Grid, Box, List, Drawer as MuiDrawer, Toolbar, Divider, IconButton, CssBaseline, Typography } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material'
import NavLink from './NavLink'
import NavButton from './NavButton'

const drawerWidth: number = 270

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
)

const mdTheme = createTheme()

interface DashboardProps {
    walletExists: boolean
    onSendTransaction: () => void
    onCloseWallet: () => void
    children?: any
}

export default function Dashboard ({ walletExists, onSendTransaction, onCloseWallet, children }: DashboardProps) {

    const [open, setOpen] = useState<boolean>(true)

    const toggleDrawer = () => {
        setOpen(!open)
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer variant='permanent' open={open} PaperProps={{ sx: { backgroundColor: '#FFFFFF' }}}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: open ? 'space-between' : 'flex-end',
                            px: [1],
                        }}
                    >
                        { open && (
                            <Typography noWrap variant='h6' color='primary.main'>
                                Chainerd
                            </Typography>
                        )}
                        <IconButton onClick={toggleDrawer}>
                            { open ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component='nav'>
                        <NavLink
                            to='portfolio'
                            type='portfolio'
                            name='Portfolio' />
                        <NavLink
                            to='accounts'
                            type='accounts'
                            name='Accounts' />
                        <NavButton
                            type='send'
                            name='Send'
                            onClick={onSendTransaction} />
                        <NavButton
                            type='delete'
                            name='Delete'
                            onClick={onCloseWallet} />
                    </List>
                </Drawer>
                <Box
                    component='main'
                    sx={{
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                        backgroundColor: '#F9F9F9'
                    }}
                >
                    <Toolbar />
                    <Container maxWidth='lg' sx={{ mt: 4, mb: 4, ...!walletExists && { width: '60%' } }}>
                        <Grid container>
                            <Grid item xs={12}>
                                { children }
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    )
}