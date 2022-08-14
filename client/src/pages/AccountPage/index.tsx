import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { portfolioActions } from '../../slices/portfolio'
import { accountActions } from '../../slices/account'
import {
    getSelectedAddress,
    getSelectedPage,
    getPeriodType,
    getIsFiat,
    getChartData,
    getBalance,
    getIsChartDataLoading,
    getTransactionCount,
    getTransactions,
    getTransactionsLoading,
    getTransactionsFetched,
} from '../../selectors/account'
import ViewAccountBalance from '../../components/ViewAccountBalance'
import Transactions from '../../components/Transactions'
import { Box } from '@mui/material'


export default function AccountPage () {

    const params = useParams()

    const selectedAddress = useSelector(getSelectedAddress)
    const selectedPage = useSelector(getSelectedPage)

    const periodType = useSelector(getPeriodType)
    const isFiat = useSelector(getIsFiat)
    const chartData = useSelector(getChartData)
    const chartDataLoading = useSelector(getIsChartDataLoading)
    const balance = useSelector(getBalance)

    const transactionCount = useSelector(getTransactionCount)
    const transactions = useSelector(getTransactions)
    const transactionsLoading = useSelector(getTransactionsLoading)
    const transactionsFetched = useSelector(getTransactionsFetched)

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

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        dispatch(accountActions.setSelectedPage({ page: page + 1 }))
    }

    const handleTransactionClick = (hash: string) => {
        // TODO: Open transaction details modal
        console.log(hash)
    }

    useEffect(() => {
        if (params && params.address) {
            dispatch(accountActions.setSelectedAddress({ address: params.address }))
        }
    }, [params])

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

    useEffect(() => {
        if (selectedAddress && !transactionsFetched) {
            dispatch(accountActions.fetchTransactions({ address: selectedAddress, page: selectedPage }))
        }
    }, [selectedAddress, selectedPage, transactionsFetched])

    const transactionsData = transactions.map(transaction => ({
        withdrawal: false,
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        date: transaction.timestamp,
        value: transaction.value,
        amount: transaction.amount
    }))

    return (
        <React.Fragment>
            <ViewAccountBalance
                balance={balance}
                chartData={Array.isArray(chartData) ? chartData : []}
                chartDataLoading={chartDataLoading}
                fiat={isFiat}
                periodType={periodType}
                height={300}
                onChangeBalanceView={handleChangeBalanceView}
                onChangePeriod={handleChangePeriodType} />
            <Box marginTop='100px' />
            <Transactions
                transactions={transactionsData}
                loading={transactionsLoading}
                latest={false}
                onClickTransaction={handleTransactionClick}
                paginationProps={{
                    rowsPerPageOptions: [5],
                    count: transactionCount,
                    rowsPerPage: 5,
                    page: selectedPage - 1,
                    onPageChange: handleChangePage,
                }} />
        </React.Fragment>
    )
}