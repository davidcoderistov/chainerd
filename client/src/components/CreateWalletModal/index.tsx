import React, { useState, useMemo } from 'react'
import  {Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Stepper, Step, StepLabel } from '@mui/material'
import { Grid, styled, IconButton, Button } from '@mui/material'
import CreatePassword from './CreatePassword'
import ShowSeed from './ShowSeed'
import CreateWallet from './CreateWallet'
import { Close } from '@mui/icons-material'
import { passwordRules, confirmPasswordRules } from './CreatePassword'
import { useFormInputValidator } from '../../hooks'
import { keystore } from 'eth-lightwallet'

const steps = [
    'Create Password',
    'Seed Info',
    'Create Wallet',
]


const DialogTitleStyled = styled(DialogTitle)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

interface CreateWalletModalProps {
    open: boolean,
    onCreatePassword: (password: string) => void,
    onCreateWallet: () => void,
}

export default function CreateWalletModal({ open, onCreatePassword, onCreateWallet } : CreateWalletModalProps) {

    const [activeStep, setActiveStep] = useState<number>(0)

    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const [isPasswordDirty, errorPassword, handleBlurPassword] = useFormInputValidator(passwordRules, [password], [password])
    const [isConfirmPasswordDirty, errorConfirmPassword, handleBlurConfirmPassword] = useFormInputValidator(confirmPasswordRules, [confirmPassword, password], [confirmPassword])

    const [seedInfo, setSeedInfo] = useState<Array<{ name: string, index: number }>>([])

    const onClickWord = (seedInfo: Array<{ name: string, index: number }>) => {
        setSeedInfo(seedInfo)
    }

    const handleOnContinue = () => {
        setActiveStep(activeStep + 1)
    }

    const seed = useMemo(() => {
        const seed = keystore.generateRandomSeed()
        return seed.split(' ')
    }, [])

    const buttonDisabled = activeStep === 0 ? !isPasswordDirty || errorPassword.has || !isConfirmPasswordDirty || errorConfirmPassword.has : false

    return (
        <Dialog open={open} fullWidth={true} maxWidth='sm' scroll='paper'>
            <DialogTitleStyled>
                <div/>
                <div>Create Wallet</div>
                <IconButton
                    aria-label='close'
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
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
                                    <CreatePassword
                                        password={password}
                                        onChangePassword={setPassword}
                                        onBlurPassword={handleBlurPassword}
                                        errorPassword={errorPassword}
                                        confirmPassword={confirmPassword}
                                        onChangeConfirmPassword={setConfirmPassword}
                                        onBlurConfirmPassword={handleBlurConfirmPassword}
                                        errorConfirmPassword={errorConfirmPassword} />
                                )}
                                { activeStep === 1 && (
                                    <ShowSeed seed={seed} />
                                )}

                                { activeStep > 1 && (
                                    <CreateWallet
                                        seed={seed}
                                        seedInfo={seedInfo}
                                        onClickWord={onClickWord} />
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