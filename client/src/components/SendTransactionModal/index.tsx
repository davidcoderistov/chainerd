import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { transactionActions } from '../../slices/transaction'
import { getAddresses } from '../../selectors/keystore'
import {
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
} from '../../selectors/transaction'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Stepper, Step, StepLabel } from '@mui/material'
import { Grid, IconButton, styled } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Close } from '@mui/icons-material'
import RecipientStep from './RecipientStep'
import AmountStep, { AmountStepProps } from './AmountStep'
import SummaryStep from './SummaryStep'
import ConfirmPasswordModal from '../ConfirmPasswordModal'
import { toRoundedEth, toRoundedFiat } from '../../utils'
import { ethers } from 'ethers'


const steps = [
    'Recipient',
    'Amount',
    'Summary',
]

const DialogTitleStyled = styled(DialogTitle)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

interface SendTransactionModalProps {
    open: boolean,
    onClose: () => void,
    onConfirm: () => void,
}

export default function SendTransactionModal ({ open, onClose, onConfirm } : SendTransactionModalProps) {

    const dispatch = useDispatch()

    const [activeStep, setActiveStep] = useState<number>(0)

    const addresses = useSelector(getAddresses)
    const showAddresses = addresses.map(({ address, alias }) => alias ? alias : address)
    const [fromAddress, setFromAddress] = useState<string>(addresses.length > 0 ? addresses[0].address : '')
    const [toAddress, setToAddress] = useState<string>('')

    const loading = useSelector(getLoading)
    const ethAmount = useSelector(getEthAmount)
    const fiatAmount = useSelector(getFiatAmount)

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

    const [isConfirmPasswordModalOpen, setIsConfirmPasswordModalOpen] = useState<boolean>(false)

    const handleCloseConfirmPasswordModal = () => {
        setIsConfirmPasswordModalOpen(false)
    }

    const handleConfirmPassword = (password: string) => {
        setIsConfirmPasswordModalOpen(false)
        dispatch(transactionActions.sendTransaction({
            fromAddress,
            toAddress,
            password,
        }))
    }

    const handleOnContinue = () => {
        if (activeStep < 2) {
            setActiveStep(activeStep + 1)
        } else {
            setIsConfirmPasswordModalOpen(true)
        }
    }

    const buttonDisabled = activeStep > 1 ? false :
        activeStep > 0 ? (ethAmount.trim().length <=0 && fiatAmount.trim().length <= 0) :
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
                        onClick={onClose}
                    >
                        <Close />
                    </IconButton>
                </DialogTitleStyled>
                <DialogContent dividers={true}>
                    <div style={{ height: '400px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{ label }</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 1, mx: 1 }}>
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
                                        fiatTotalAmount={toRoundedFiat(fiatTotal)}  />
                                )}
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        sx={{ mr:1 }}
                        disabled={buttonDisabled}
                        loading={loading}
                        onClick={handleOnContinue}>
                        { activeStep < 2 ? 'Continue' : 'Confirm' }
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <ConfirmPasswordModal
                open={isConfirmPasswordModalOpen}
                onClose={handleCloseConfirmPasswordModal}
                onConfirm={handleConfirmPassword} />
        </React.Fragment>
    )
}