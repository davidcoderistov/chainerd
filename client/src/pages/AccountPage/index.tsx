import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { portfolioActions } from '../../slices/portfolio'
import { accountActions } from '../../slices/account'
import {
    getSelectedAddress,
    getPeriodType,
    getIsFiat,
    getChartData,
    getBalance,
    getIsChartDataLoading,
} from '../../selectors/account'
import ViewAccountBalance from '../../components/ViewAccountBalance'


export default function AccountPage () {

    const selectedAddress = useSelector(getSelectedAddress)
    const periodType = useSelector(getPeriodType)
    const isFiat = useSelector(getIsFiat)
    const chartData = useSelector(getChartData)
    const chartDataLoading = useSelector(getIsChartDataLoading)
    const balance = useSelector(getBalance)

    const dispatch = useDispatch()

    const handleChangeBalanceView = () => {
        if (selectedAddress) {
            dispatch(accountActions.setIsFiat({ isFiat: !isFiat }))
        }
    }

    const handleChangePeriodType = (periodType: 'weekly' | 'monthly' | 'yearly') => {
        if (selectedAddress) {
            dispatch(accountActions.setPeriodType({ periodType }))
        }
    }

    useEffect(() => {
        dispatch(accountActions.setSelectedAddress({ address: '0xC7Bb73ac36c6f5c12d5d419F0e03C919a53aaBed' }))
    }, [])

    useEffect(() => {
        if (selectedAddress && !chartData) {
             if (periodType === 'weekly') {
                 dispatch(portfolioActions.fetchWeekly({ address: selectedAddress }))
             } else if (periodType === 'monthly') {
                 dispatch(portfolioActions.fetchMonthly({ address: selectedAddress }))
             } else if (periodType === 'yearly') {
                 dispatch(portfolioActions.fetchYearly({ address: selectedAddress }))
             }
        }
    }, [selectedAddress, periodType])

    return (
        <ViewAccountBalance
            balance={balance}
            chartData={Array.isArray(chartData) ? chartData : []}
            chartDataLoading={chartDataLoading}
            fiat={isFiat}
            periodType={periodType}
            height={300}
            onChangeBalanceView={handleChangeBalanceView}
            onChangePeriod={handleChangePeriodType} />
    )
}