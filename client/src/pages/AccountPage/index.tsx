import React, { useState, useEffect } from 'react'
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
    getTransactionsData,
    getTransactionsLoading,
    getTransactionsFetched,
} from '../../selectors/account'
import ViewAccountBalance from '../../components/ViewAccountBalance'
import Transactions from '../../components/Transactions'
import TransactionDetailsModal, { Transaction } from '../../components/TransactionDetailsModal'
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
    const transactionsData = useSelector(getTransactionsData)
    const transactionsLoading = useSelector(getTransactionsLoading)
    const transactionsFetched = useSelector(getTransactionsFetched)

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

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
        const transaction = transactionsData.modal.find(transaction => transaction.transactionHash === hash)
        setSelectedTransaction(transaction ? transaction : null)
    }

    const handleCloseTransactionDetailsModal = () => {
        setSelectedTransaction(null)
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
                transactions={transactionsData.table}
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
            { selectedTransaction && (
                <TransactionDetailsModal
                    open={true}
                    onClose={handleCloseTransactionDetailsModal}
                    withdrawal={selectedTransaction.withdrawal}
                    ethAmount={selectedTransaction.ethAmount}
                    fiatAmount={selectedTransaction.fiatAmount}
                    account={selectedTransaction.account}
                    timestamp={selectedTransaction.timestamp}
                    fee={selectedTransaction.fee}
                    status={selectedTransaction.status}
                    blockNumber={selectedTransaction.blockNumber}
                    transactionHash={selectedTransaction.transactionHash}
                    from={selectedTransaction.from}
                    to={selectedTransaction.to} />
            )}
        </React.Fragment>
    )
}