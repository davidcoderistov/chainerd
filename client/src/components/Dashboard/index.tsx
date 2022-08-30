import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addressActions } from '../../slices/address'
import { networkActions } from '../../slices/network'
import { getSyncing, getAddressesLoading } from '../../selectors/address'
import { getNetwork } from '../../selectors/network'
import { ThemeContext, NETWORK } from '../../config'
import { Container, Grid, Box, List, Drawer as MuiDrawer, Toolbar, Divider, Tooltip, CssBaseline, Typography, Switch, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Sync } from '@mui/icons-material'
import NavLink from './NavLink'
import NavButton from './NavButton'
import MenuButton, { Option } from '../MenuButton'


const networkOptions: Array<{ id: NETWORK, name: string }> = [
    {
        id: 'mainnet',
        name: 'Ethereum Mainnet'
    },
    {
        id: 'goerli',
        name: 'Goerli Testnet'
    },
    {
        id: 'kovan',
        name: 'Kovan Testnet'
    },
    {
        id: 'rinkeby',
        name: 'Rinkeby Testnet'
    },
    {
        id: 'ropsten',
        name: 'Ropsten Testnet'
    },
    {
        id: 'sepolia',
        name: 'Sepolia Testnet'
    },
]

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

const SwitchMode = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}))

const mdTheme = createTheme()

interface DashboardProps {
    walletExists: boolean
    walletLoading: boolean
    onSendTransaction: () => void
    onCloseWallet: () => void
    children?: any
}

export default function Dashboard ({ walletExists, walletLoading, onSendTransaction, onCloseWallet, children }: DashboardProps) {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { theme, changeTheme, dark } = useContext(ThemeContext)

    const [open, setOpen] = useState<boolean>(true)

    const isSyncing = useSelector(getSyncing)
    const addressesLoading = useSelector(getAddressesLoading)
    const network = useSelector(getNetwork)
    const selectedNetwork = networkOptions.find(n => n.id === network)

    const toggleDrawer = () => {
        setOpen(!open)
    }

    const handleSwitchMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeTheme(event.target.checked)
    }

    const handleSyncEthPrice = () => {
        dispatch(addressActions.syncEthPrice())
    }

    const handleChangeNetwork = (option: Option<NETWORK, string>) => {
        dispatch(networkActions.setNetwork({ network: option.id }))
        navigate('/')
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer variant='permanent' open={open} PaperProps={{ sx: { backgroundColor: theme.menu.background }}}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: open ? 'space-between' : 'flex-end',
                            px: [1],
                        }}
                    >
                        { open && (
                            <Typography noWrap variant='h6' color={theme.main.button}>
                                Chainerd
                            </Typography>
                        )}
                        <IconButton onClick={toggleDrawer} sx={{ color: theme.main.paper.text.primary }}>
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
                        backgroundColor: theme.main.background
                    }}
                >
                    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                        <Grid container>
                            <Grid container item xs={12} sx={{ mb: 3 }} justifyContent='end' alignItems='center'>
                                <MenuButton
                                    options={networkOptions}
                                    disabled={false}
                                    size='large'
                                    sxProps={dark ? { backgroundColor: theme.menu.background, borderRadius: '30px', mr: 3 } : { mr: 3 }}
                                    onChange={handleChangeNetwork}>
                                    { selectedNetwork ? selectedNetwork.name : 'N/A' }
                                </MenuButton>
                                { walletExists && (
                                    <Tooltip title='Sync eth price' placement='bottom' arrow>
                                        <span>
                                            <LoadingButton
                                                sx={{ color: theme.main.sync , ...dark && { '&:hover': { backgroundColor: theme.menu.background }} }}
                                                onClick={handleSyncEthPrice}
                                                loading={isSyncing}
                                                disabled={walletLoading || addressesLoading}>
                                                <Sync />
                                        </LoadingButton>
                                        </span>
                                    </Tooltip>
                                )}
                                <SwitchMode onChange={handleSwitchMode} defaultChecked />
                            </Grid>
                            { !walletExists && !walletLoading ? (
                                <Grid container item xs={12} justifyContent='center'>
                                    <Box width='60%'>
                                        { children }
                                    </Box>
                                </Grid>
                            ): (
                                <Grid item xs={12}>
                                    { children }
                                </Grid>
                            )}
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    )
}