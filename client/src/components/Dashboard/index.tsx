import React, { useState } from 'react'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { Container, Grid, Box, Drawer as MuiDrawer, Toolbar, Typography, Divider, IconButton, Button, CssBaseline } from '@mui/material'
import { List, ListItemIcon, ListItemText, ListItemButton } from '@mui/material'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import { ChevronLeft as ChevronLeftIcon, Dashboard as DashboardIcon, Menu as MenuIcon } from '@mui/icons-material'


const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
    open?: boolean
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

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
    walletExists: boolean,
    onCreateWallet: () => void,
    onRestoreWallet: () => void,
    onSendTransaction: () => void,
    onCloseWallet: () => void,
    children?: any
}

export default function Dashboard ({ walletExists, onCreateWallet, onRestoreWallet, onSendTransaction, onCloseWallet, children }: DashboardProps) {

    const [open, setOpen] = useState<boolean>(true)

    const toggleDrawer = () => {
        setOpen(!open)
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position='absolute' open={open}>
                    <MuiAppBar position='static' sx={{ backgroundColor: '#29242D' }}>
                        <Toolbar>
                            <IconButton
                                edge='start'
                                color='inherit'
                                aria-label='open drawer'
                                onClick={toggleDrawer}
                                sx={{
                                    marginRight: '36px',
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                variant='h6'
                                noWrap
                                component='div'
                                sx={{ display: { xs: 'none', sm: 'block' } }}
                            >
                                Chainerd
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box sx={{ display: { xs: 'none', md: 'flex', columnGap: '10px' } }}>
                                { walletExists ? (
                                    <React.Fragment>
                                        <Button color='primary' variant='outlined' onClick={onSendTransaction}>
                                            Send Transaction
                                        </Button>
                                        <Button color='warning' variant='outlined' onClick={onCloseWallet}>
                                            Close Wallet
                                        </Button>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <Button color='primary' variant='outlined' onClick={onCreateWallet}>
                                            Create Wallet
                                        </Button>
                                        <Button color='warning' variant='outlined' onClick={onRestoreWallet}>
                                            Restore Wallet
                                        </Button>
                                    </React.Fragment>
                                )}
                            </Box>
                        </Toolbar>
                    </MuiAppBar>
                </AppBar>
                <Drawer variant='permanent' open={open} PaperProps={{ sx: { backgroundColor: '#29242D', color: 'white' }}}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer} sx={{ color: '#FFFFFF' }}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component='nav'>
                        <ListItemButton>
                            <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary='Accounts' />
                        </ListItemButton>
                        <Divider sx={{ my: 1 }} />
                    </List>
                </Drawer>
                <Box
                    component='main'
                    sx={{
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                        backgroundColor: 'rgb(249, 249, 249)'
                    }}
                >
                    <Toolbar />
                    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
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