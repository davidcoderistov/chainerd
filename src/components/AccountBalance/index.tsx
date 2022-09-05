import React from 'react'
import { Grid } from '@mui/material'
import Balance from './Balance'
import TogglePeriod from './TogglePeriod'
import AccountBalanceChart from '../AccountBalanceChart'

export interface AccountBalanceProps {
    balance: number
    chartData: Array<{ x: string, y: string }>
    chartDataLoading: boolean
    disabled: boolean
    fiat: boolean
    periodType: 'weekly' | 'monthly' | 'yearly'
    height: number
    onChangeBalanceView: () => void
    onChangePeriod: (period: 'weekly' | 'monthly' | 'yearly') => void
    sxContainer?: any
}

export default function AccountBalance ({ balance, chartData, chartDataLoading, disabled, periodType, fiat, onChangeBalanceView, onChangePeriod, height, sxContainer = {} }: AccountBalanceProps) {

    return (
        <Grid container sx={sxContainer}>
            <Grid item xs={12}>
                <Balance balance={balance} fiat={fiat} onChangeBalanceView={onChangeBalanceView} loading={chartDataLoading}/>
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: '10px' }} container direction='row-reverse'>
                <TogglePeriod period={periodType} onChangePeriod={onChangePeriod} disabled={chartDataLoading || disabled}/>
            </Grid>
            <Grid item xs={12}>
                <AccountBalanceChart data={chartData} type={periodType} loading={chartDataLoading} fiat={fiat} height={height} />
            </Grid>
        </Grid>
    )
}