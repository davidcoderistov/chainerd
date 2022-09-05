import React, { useContext } from 'react'
import { ThemeContext } from '../../config'
import { ToggleButtonGroup, ToggleButton, ThemeProvider, createTheme } from '@mui/material'

export interface TogglePeriodProps {
    period: 'weekly' | 'monthly' | 'yearly'
    onChangePeriod: (period: 'weekly' | 'monthly' | 'yearly') => void
    disabled: boolean
}

const customTheme = createTheme({
    palette: {
        primary: {
            main: "#4B61D1"
        }
    }
})

export default function TogglePeriod ({ period, onChangePeriod, disabled }: TogglePeriodProps) {

    const { theme, dark } = useContext(ThemeContext)

    const handleChange = (event: React.MouseEvent<HTMLElement>, period: 'weekly' | 'monthly' | 'yearly' | null) => {
        if (period) {
            onChangePeriod(period)
        }
    }

    const content = (
        <ToggleButtonGroup
            color='primary'
            size='small'
            value={period}
            exclusive
            onChange={handleChange}
            disabled={disabled}
        >
            <ToggleButton value='weekly' sx={{ ...period !== 'weekly' && { color: theme.main.paper.text.primary }, '&:hover': { backgroundColor: theme.main.paper.hover }}}>1W</ToggleButton>
            <ToggleButton value='monthly' sx={{ ...period !== 'monthly' && { color: theme.main.paper.text.primary }, '&:hover': { backgroundColor: theme.main.paper.hover }}}>1M</ToggleButton>
            <ToggleButton value='yearly' sx={{ ...period !== 'yearly' && { color: theme.main.paper.text.primary }, '&:hover': { backgroundColor: theme.main.paper.hover }}}>1Y</ToggleButton>
        </ToggleButtonGroup>
    )

    return dark ? (
        <ThemeProvider theme={customTheme}>
            { content }
        </ThemeProvider>
    ) : content
}