import React from 'react'

export const themes = {
    light: {
        menu: {
            background: '#FFFFFF',
            link: {
                background: {
                    active: '#EFF4FE',
                    hovered: '#F9F9F9',
                    main: '#FFFFFF',
                },
                icon: {
                    active: '#1976d2',
                    main: '#9f9f9f',
                },
                text: {
                    active: '#1976d2',
                    main: '#000000'
                }
            }
        },
        main: {
            background: '#F9F9F9',
            link: 'text.secondary',
            paper: {
                background: '#FFFFFF',
                text: {
                    primary: '#000000',
                    secondary: 'text.secondary',
                    disabled: '#D3D3D3',
                },
                hover: {
                    background: '#F9F9F9'
                },
                icon: 'text.secondary'
            },
            sync: 'primary.main',
        }
    },
    dark: {
        menu: {
            background: '#17171A',
            link: {
                background: {
                    active: '#222430',
                    hovered: '#222430',
                    main: '#17171A',
                },
                icon: {
                    active: '#1976d2',
                    main: '#FFFFFF',
                },
                text: {
                    active: '#1976d2',
                    main: '#FFFFFF'
                }
            }
        },
        main: {
            background: '#222430',
            link: '#FFFFFF',
            paper: {
                background: '#323546',
                text: {
                    primary: '#FFFFFF',
                    secondary: '#99A7BB',
                    disabled: '#222430',
                },
                hover: {
                    background: '#222430'
                },
                icon: '#FFFFFF'
            },
            sync: '#FFFFFF'
        }
    }
}

export const ThemeContext = React.createContext({ theme: themes.light, changeTheme: (dark: boolean) => {} })

export type NETWORK = 'mainnet' | 'goerli' | 'kovan' | 'rinkeby' | 'ropsten' | 'sepolia'

export const NETWORKS = {
    MAINNET: 'mainnet',
    GOERLI: 'goerli',
    KOVAN: 'kovan',
    RINKEBY: 'rinkeby',
    ROPSTEN: 'ropsten',
    SEPOLIA: 'sepolia',
}