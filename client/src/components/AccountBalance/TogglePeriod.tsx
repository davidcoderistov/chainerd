import React from 'react'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

export interface TogglePeriodProps {
    period: 'weekly' | 'monthly' | 'yearly'
    onChangePeriod: (period: 'weekly' | 'monthly' | 'yearly') => void
}

export default function TogglePeriod ({ period, onChangePeriod }: TogglePeriodProps) {

    const handleChange = (event: React.MouseEvent<HTMLElement>, period: 'weekly' | 'monthly' | 'yearly' | null) => {
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
            <ToggleButton value='weekly'>1W</ToggleButton>
            <ToggleButton value='monthly'>1M</ToggleButton>
            <ToggleButton value='yearly'>1Y</ToggleButton>
        </ToggleButtonGroup>
    )
}