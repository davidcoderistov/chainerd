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
            background: '#F9F9F9'
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
            background: '#222430'
        }
    }
}

export const ThemeContext = React.createContext({ theme: themes.light, changeTheme: (dark: boolean) => {} })