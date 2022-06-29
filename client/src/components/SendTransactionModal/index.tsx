import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getAddresses } from '../../selectors/keystore'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Stepper, Step, StepLabel } from '@mui/material'
import { Grid, Button, IconButton, styled } from '@mui/material'
import { Close } from '@mui/icons-material'
import RecipientStep from './RecipientStep'
import AmountStep, { AmountStepProps } from './AmountStep'
import SummaryStep from './SummaryStep'
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

    const [activeStep, setActiveStep] = useState<number>(0)

    const addresses = useSelector(getAddresses)
    const [fromAddress, setFromAddress] = useState<string>(addresses.length > 0 ? addresses[0].address : '')
    const [toAddress, setToAddress] = useState<string>('')

    const [cryptoAmount, setCryptoAmount] = useState<string>('20')
    const [fiatAmount, setFiatAmount] = useState<string>('30')
    const [gasPrice, setGasPrice] = useState<AmountStepProps['gasPrice']>(65)

    const handleOnContinue = () => {
        if (activeStep < 2) {
            setActiveStep(activeStep + 1)
        } else {
            onConfirm()
        }
    }

    const buttonDisabled = activeStep > 0 ? false : (addresses.length <= 0 || !ethers.utils.isAddress(toAddress))

    return (
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
                                    addresses={addresses.map(({ address }) => address)}
                                    fromAddress={fromAddress}
                                    onChangeFromAddress={setFromAddress}
                                    toAddress={toAddress}
                                    onChangeToAddress={setToAddress} />
                            )}
                            { activeStep === 1 && (
                                <AmountStep
                                    cryptoAmount={cryptoAmount}
                                    onChangeCryptoAmount={setCryptoAmount}
                                    fiatAmount={fiatAmount}
                                    onChangeFiatAmount={setFiatAmount}
                                    gasPrice={gasPrice}
                                    onChangeGasPrice={setGasPrice} />
                            )}
                            { activeStep === 2 && (
                                <SummaryStep
                                    fromAddress='0x05fE66a4F7577b060831F572eE63BBCb51b2D16A'
                                    toAddress='0x05fE66a4F7577b060831F572eE63BBCb51b2D16A'
                                    cryptoWithdrawAmount='0.02 ETH'
                                    fiatWithdrawAmount='$35.32'
                                    cryptoFees='0.001386 ETH'
                                    fiatFees='$2.449'
                                    cryptoTotalAmount='0.021386 ETH'
                                    fiatTotalAmount='$37.79'  />
                            )}
                        </Grid>
                    </Grid>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ mr:1 }}
                    disabled={buttonDisabled}
                    onClick={handleOnContinue}>
                        { activeStep < 2 ? 'Continue' : 'Confirm' }
                </Button>
            </DialogActions>
        </Dialog>
    )
}