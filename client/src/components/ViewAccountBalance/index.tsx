import React, { useContext } from 'react'
import { ThemeContext } from '../../config'
import { Paper } from '@mui/material'
import AccountBalance, { AccountBalanceProps } from '../AccountBalance'


export default function ViewAccountBalance (props: AccountBalanceProps) {

    const { theme } = useContext(ThemeContext)

    return (
        <Paper sx={{ padding: '30px', minWidth: 750, backgroundColor: theme.main.paper.background }} elevation={4}>
            <AccountBalance
                balance={props.balance}
                chartData={props.chartData}
                chartDataLoading={props.chartDataLoading}
                disabled={props.chartDataLoading}
                fiat={props.fiat}
                periodType={props.periodType}
                height={props.height}
                onChangeBalanceView={props.onChangeBalanceView}
                onChangePeriod={props.onChangePeriod} />
        </Paper>
    )
}