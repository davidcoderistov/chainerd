import React from 'react'
import { Paper, Grid } from '@mui/material'
import Balance, { BalanceProps } from './Balance'
import TogglePeriod, { TogglePeriodProps } from './TogglePeriod'
import AccountBalanceChart, { AccountBalanceChartProps } from '../AccountBalanceChart'

type AccountBalanceProps = BalanceProps & TogglePeriodProps & AccountBalanceChartProps

export default function AccountBalance ({ balance, fiat, onChangeBalanceView, period, onChangePeriod, data, type, loading, height }: AccountBalanceProps) {

    return (
        <Paper sx={{ padding: '30px' }} elevation={4}>
            <Grid container>
                <Grid item xs={12}>
                    <Balance balance={balance} fiat={fiat} onChangeBalanceView={onChangeBalanceView}/>
                </Grid>
                <Grid item xs={12} sx={{ marginBottom: '10px' }} container direction='row-reverse'>
                    <TogglePeriod period={period} onChangePeriod={onChangePeriod} />
                </Grid>
                <Grid item xs={12}>
                    <AccountBalanceChart data={data} type={type} loading={loading} height={height} />
                </Grid>
            </Grid>
        </Paper>
    )
}