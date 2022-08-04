import React from 'react'
import { Paper, Grid } from '@mui/material'
import Balance from './Balance'
import TogglePeriod from './TogglePeriod'
import AccountBalanceChart from '../AccountBalanceChart'

export interface AccountBalanceProps {
    balance: number
    chartData: Array<{ x: string, y: string }>
    chartDataLoading: boolean
    fiat: boolean
    periodType: 'weekly' | 'monthly' | 'yearly'
    height: number
    onChangeBalanceView: () => void
    onChangePeriod: (period: 'weekly' | 'monthly' | 'yearly') => void
}

export default function AccountBalance ({ balance, chartData, chartDataLoading, periodType, fiat, onChangeBalanceView, onChangePeriod, height }: AccountBalanceProps) {

    return (
        <Grid container>
            <Grid item xs={12}>
                <Balance balance={balance} fiat={fiat} onChangeBalanceView={onChangeBalanceView} loading={chartDataLoading}/>
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: '10px' }} container direction='row-reverse'>
                <TogglePeriod period={periodType} onChangePeriod={onChangePeriod} disabled={chartDataLoading}/>
            </Grid>
            <Grid item xs={12}>
                <AccountBalanceChart data={chartData} type={periodType} loading={chartDataLoading} fiat={fiat} height={height} />
            </Grid>
        </Grid>
    )
}