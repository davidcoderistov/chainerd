import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { transactionActions } from '../../slices/transaction'
import { getAddresses } from '../../selectors/address'
import {
    getActiveStep,
    getFromAddress,
    getToAddress,
    getEthAmount,
    getFiatAmount,
    getLowGasPrice,
    getHighGasPrice,
    getGasPrice,
    getLoading,
    getEthNetworkFees,
    getFiatNetworkFees,
    getEthTotalAmount,
    getFiatTotalAmount,
    getAddressEthAmount,
    isSendTransactionError,
    getHash,
} from '../../selectors/transaction'
import { getNetwork } from '../../selectors/network'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Stepper, Step, StepLabel } from '@mui/material'
import { Grid, IconButton, CircularProgress, styled } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Close } from '@mui/icons-material'
import RecipientStep from './RecipientStep'
import AmountStep, { AmountStepProps, ethAmountRules } from './AmountStep'
import SummaryStep from './SummaryStep'
import ConfirmPasswordModal from '../ConfirmPasswordModal'
import { toRoundedEth, toRoundedFiat } from '../../utils'
import { useFormInputValidator } from '../../hooks'
import { ethers } from 'ethers'


const steps = [
    'Recipient',
    'Amount',
    'Summary',
]

const transactionSteps = [
    'Initiating',
    'Waiting for confirmation',
    'Transaction mined',
]

const DialogTitleStyled = styled(DialogTitle)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

const CustomCircularProgress = () => <CircularProgress size={22} />

interface SendTransactionModalProps {
    open: boolean,
    onClose: () => void,
}

export default function SendTransactionModal ({ open, onClose } : SendTransactionModalProps) {

    const dispatch = useDispatch()

    const [transactionInitiated, setTransactionInitiated] = useState<boolean>(false)

    const activeStep = useSelector(getActiveStep)
    const fromAddress = useSelector(getFromAddress)
    const toAddress = useSelector(getToAddress)
    const addresses = useSelector(getAddresses)
    const showAddresses = addresses.map(({ address, alias }) => alias ? alias : address)

    const loading = useSelector(getLoading)
    const error = useSelector(isSendTransactionError)
    const ethAmount = useSelector(getEthAmount)
    const fiatAmount = useSelector(getFiatAmount)
    const transactionHash = useSelector(getHash)

    const setActiveStep = (step: number) => {
        dispatch(transactionActions.setActiveStep({ step }))
    }

    const setFromAddress = (address: string) => {
        dispatch(transactionActions.setFromAddress({ address }))
    }

    const setToAddress = (address: string) => {
        dispatch(transactionActions.setToAddress({ address }))
    }

    const handleChangeEthAmount = (ethAmount: string) => {
        dispatch(transactionActions.setEthAmount({ ethAmount }))
    }

    const handleChangeFiatAmount = (fiatAmount: string) => {
        dispatch(transactionActions.setFiatAmount( { fiatAmount }))
    }

    const lowGasPrice = useSelector(getLowGasPrice)
    const highGasPrice = useSelector(getHighGasPrice)
    const gasPrice = useSelector(getGasPrice)

    useEffect(() => {
        dispatch(transactionActions.setGasInfo())
    }, [])

    const handleChangeGasPrice = (gasPrice: AmountStepProps['gasPrice']) => {
        dispatch(transactionActions.setGasPrice({ gasPrice: Number(gasPrice) }))
    }

    const ethFee = useSelector(getEthNetworkFees)
    const fiatFee = useSelector(getFiatNetworkFees)
    const ethTotal = useSelector(getEthTotalAmount)
    const fiatTotal = useSelector(getFiatTotalAmount)
    const addressEthTotal = useSelector(getAddressEthAmount)

    const selectedNetwork = useSelector(getNetwork)
    const network = selectedNetwork === 'mainnet' ? null : selectedNetwork

    const [, errorEthAmount, handleBlurEthAmount] = useFormInputValidator(ethAmountRules, [ethTotal.toString(), addressEthTotal.toString()], [ethTotal])

    const [isConfirmPasswordModalOpen, setIsConfirmPasswordModalOpen] = useState<boolean>(false)

    const handleCloseConfirmPasswordModal = () => {
        setIsConfirmPasswordModalOpen(false)
    }

    const handleConfirmPassword = (password: string) => {
        setIsConfirmPasswordModalOpen(false)
        const from = addresses.find(address => address.address === fromAddress || address.alias === fromAddress)
        if (from) {
            setActiveStep(0)
            setTransactionInitiated(true)
            dispatch(transactionActions.sendTransaction({
                fromAddress: from.address,
                toAddress,
                password,
            }))
        }
    }

    const handleCloseSendTransactionModal = () => {
        dispatch(transactionActions.clearAll())
        onClose()
    }

    useEffect(() => {
        if (error) {
            setActiveStep(2)
            setTransactionInitiated(false)
        }
    }, [error])

    const handleOnContinue = () => {
        if (activeStep < 2) {
            setActiveStep(activeStep + 1)
        } else {
            setIsConfirmPasswordModalOpen(true)
        }
    }

    const buttonDisabled = activeStep > 1 ? false :
        activeStep > 0 ? (ethAmount.trim().length <=0 && fiatAmount.trim().length <= 0) || errorEthAmount.has :
            (addresses.length <= 0 || !ethers.utils.isAddress(toAddress))

    return (
        <React.Fragment>
            <Dialog open={open} fullWidth maxWidth='sm' scroll='paper'>
                <DialogTitleStyled>
                    <div/>
                    <div>Send</div>
                    <IconButton
                        aria-label='close'
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                        onClick={handleCloseSendTransactionModal}
                        disabled={loading}
                    >
                        <Close />
                    </IconButton>
                </DialogTitleStyled>
                <DialogContent dividers={true}>
                    <div style={{ height: '400px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    { transactionInitiated ?
                                        transactionSteps.map((label, index) => (
                                            <Step key={label}>
                                                { index === activeStep ? (
                                                    <StepLabel StepIconComponent={CustomCircularProgress}>{ label }</StepLabel>
                                                ) : (
                                                    <StepLabel>{ label }</StepLabel>
                                                )}
                                            </Step>
                                        )) :
                                        steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{ label }</StepLabel>
                                            </Step>
                                        ))}
                                </Stepper>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 1, mx: 1 }}>
                                { transactionInitiated ? (
                                    <SummaryStep
                                        fromAddress={fromAddress}
                                        toAddress={toAddress}
                                        cryptoWithdrawAmount={ethAmount}
                                        fiatWithdrawAmount={fiatAmount}
                                        cryptoFees={toRoundedEth(ethFee)}
                                        fiatFees={toRoundedFiat(fiatFee)}
                                        cryptoTotalAmount={toRoundedEth(ethTotal)}
                                        fiatTotalAmount={toRoundedFiat(fiatTotal)}
                                        transactionHash={transactionHash}
                                        network={network} />
                                ): (
                                    <React.Fragment>
                                        { activeStep === 0 && (
                                            <RecipientStep
                                                addresses={showAddresses}
                                                fromAddress={fromAddress}
                                                onChangeFromAddress={setFromAddress}
                                                toAddress={toAddress}
                                                onChangeToAddress={setToAddress} />
                                        )}
                                        { activeStep === 1 && (
                                            <AmountStep
                                                cryptoAmount={ethAmount}
                                                onChangeCryptoAmount={handleChangeEthAmount}
                                                onBlurCryptoAmount={handleBlurEthAmount}
                                                cryptoAmountError={errorEthAmount}
                                                fiatAmount={fiatAmount}
                                                onChangeFiatAmount={handleChangeFiatAmount}
                                                lowGasPrice={lowGasPrice}
                                                highGasPrice={highGasPrice}
                                                gasPrice={gasPrice}
                                                onChangeGasPrice={handleChangeGasPrice} />
                                        )}
                                        { activeStep === 2 && (
                                            <SummaryStep
                                                fromAddress={fromAddress}
                                                toAddress={toAddress}
                                                cryptoWithdrawAmount={ethAmount}
                                                fiatWithdrawAmount={fiatAmount}
                                                cryptoFees={toRoundedEth(ethFee)}
                                                fiatFees={toRoundedFiat(fiatFee)}
                                                cryptoTotalAmount={toRoundedEth(ethTotal)}
                                                fiatTotalAmount={toRoundedFiat(fiatTotal)}
                                                network={network} />
                                        )}
                                    </React.Fragment>
                                )}
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    { !transactionInitiated && (
                        <LoadingButton
                            sx={{ mr:1 }}
                            disabled={buttonDisabled}
                            loading={loading}
                            onClick={handleOnContinue}>
                            { activeStep < 2 ? 'Continue' : 'Confirm' }
                        </LoadingButton>
                    )}
                </DialogActions>
            </Dialog>
            <ConfirmPasswordModal
                open={isConfirmPasswordModalOpen}
                onClose={handleCloseConfirmPasswordModal}
                onConfirm={handleConfirmPassword} />
        </React.Fragment>
    )
}