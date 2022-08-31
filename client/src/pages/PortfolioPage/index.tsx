import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { portfolioActions } from '../../slices/portfolio'
import {
    getIsFiat,
    getPeriodType,
    getBalanceByPortfolioAddress,
    getChartDataByPortfolioAddress,
    getIsChartDataLoadingByPortfolioAddress,
    getSelectedPortfolioAddress,
    getLatestTransactionsData,
    getLatestTransactionsLoading,
    getLatestTransactionsFetched,
} from '../../selectors/portfolio'
import {
    getAddresses,
    getAddressesLoading,
} from '../../selectors/address'
import ViewAccountBalances from '../../components/ViewAccountBalances'
import ViewAssetAllocation from '../../components/ViewAssetAllocation'
import Transactions from '../../components/Transactions'
import TransactionDetailsModal, { Transaction } from '../../components/TransactionDetailsModal'
import { Box } from '@mui/material'


export default function PortfolioPage () {

    const dispatch = useDispatch()

    // START OF CHART DATA //

    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    const addresses = useSelector(getAddresses)
    const selectedAddress = useSelector(getSelectedPortfolioAddress)
    const balance = useSelector(getBalanceByPortfolioAddress)
    const chartData = useSelector(getChartDataByPortfolioAddress)
    const chartDataLoading = useSelector(getIsChartDataLoadingByPortfolioAddress)
    const fiat = useSelector(getIsFiat)
    const periodType = useSelector(getPeriodType)

    const handleChangeBalanceView = () => {
        if (selectedAddress) {
            dispatch(portfolioActions.setIsFiat({
                address: selectedAddress,
                isFiat: !fiat,
            }))
        }
    }

    const handleChangePeriodType = (periodType: 'weekly' | 'monthly' | 'yearly') => {
        if (selectedAddress) {
            dispatch(portfolioActions.setPeriodType({
                address: selectedAddress,
                periodType,
            }))
        }
    }

    const handleSlideLeft = () => {
        setSelectedIndex(selectedIndex - 1)
    }

    const handleSlideRight = () => {
        setSelectedIndex(selectedIndex + 1)
    }

    useEffect(() => {
        if (addresses.length > 0 && selectedIndex < addresses.length) {
            dispatch(portfolioActions.setSelectedPortfolioAddress({ address: addresses[selectedIndex].address }))
        }
    }, [addresses, selectedIndex])

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

    // END OF CHART DATA //

    // START OF ALLOCATION DATA //

    const addressesLoading = useSelector(getAddressesLoading)
    const allocations = addresses.map(address => ({
        account: address.alias ? address.alias : 'N/A',
        address: address.address,
        amount: address.ethAmount.toString(),
        value: address.fiatAmount.toString(),
        allocation: address.percentage,
    }))

    // END OF ALLOCATION DATA //

    // START OF TRANSACTIONS DATA //

    const latestTransactionsData = useSelector(getLatestTransactionsData)
    const latestTransactionsLoading = useSelector(getLatestTransactionsLoading)
    const latestTransactionsFetched = useSelector(getLatestTransactionsFetched)

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

    const handleTransactionClick = (hash: string) => {
        const transaction = latestTransactionsData.modal.find(transaction => transaction.transactionHash === hash)
        setSelectedTransaction(transaction ? transaction : null)
    }

    const handleCloseTransactionDetailsModal = () => {
        setSelectedTransaction(null)
    }

    useEffect(() => {
        if (!latestTransactionsFetched && !addressesLoading && addresses.length > 0) {
            dispatch(portfolioActions.fetchLatestTransactions({
                addresses: addresses.map(address => address.address),
            }))
        }
    }, [addresses, addressesLoading, latestTransactionsFetched])

    // END OF TRANSACTIONS DATA //

    return (
        <React.Fragment>
            <ViewAccountBalances
                address={selectedAddress}
                onSlideLeft={handleSlideLeft}
                onSlideRight={handleSlideRight}
                leftDisabled={selectedIndex <= 0}
                rightDisabled={selectedIndex + 1 >= addresses.length}
                balance={balance}
                chartData={Array.isArray(chartData) ? chartData : []}
                chartDataLoading={addressesLoading || chartDataLoading}
                disabled={addressesLoading || chartDataLoading}
                fiat={fiat}
                periodType={periodType}
                onChangeBalanceView={handleChangeBalanceView}
                onChangePeriod={handleChangePeriodType}
                height={300} />
            <Box marginTop='50px' />
            <ViewAssetAllocation
                items={allocations}
                loading={addressesLoading} />
            <Box marginTop='50px' />
            <Transactions
                transactions={latestTransactionsData.table}
                loading={latestTransactionsLoading}
                latest={true}
                onClickTransaction={handleTransactionClick} />
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
