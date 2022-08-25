import React from 'react'
import { Paper } from '@mui/material'
import AccountBalance, { AccountBalanceProps } from '../AccountBalance'


export default function ViewAccountBalance (props: AccountBalanceProps) {

    return (
        <Paper sx={{ padding: '30px', minWidth: 750 }} elevation={4}>
            <AccountBalance
                balance={props.balance}
                chartData={props.chartData}
                chartDataLoading={props.chartDataLoading}
                fiat={props.fiat}
                periodType={props.periodType}
                height={props.height}
                onChangeBalanceView={props.onChangeBalanceView}
                onChangePeriod={props.onChangePeriod} />
        </Paper>
    )
}