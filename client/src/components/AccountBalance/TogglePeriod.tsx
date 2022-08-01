import React from 'react'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

export interface TogglePeriodProps {
    period: 'week' | 'month' | 'year'
    onChangePeriod: (period: 'week' | 'month' | 'year') => void
}

export default function TogglePeriod ({ period, onChangePeriod }: TogglePeriodProps) {

    const handleChange = (event: React.MouseEvent<HTMLElement>, period: 'week' | 'month' | 'year' | null) => {
        if (period) {
            onChangePeriod(period)
        }
    }

    return (
        <ToggleButtonGroup
            color='primary'
            size='small'
            value={period}
            exclusive
            onChange={handleChange}
        >
            <ToggleButton value='week'>1W</ToggleButton>
            <ToggleButton value='month'>1M</ToggleButton>
            <ToggleButton value='year'>1Y</ToggleButton>
        </ToggleButtonGroup>
    )
}