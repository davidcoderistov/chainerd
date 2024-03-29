import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { keystoreActions } from '../../slices/keystore'
import  { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Stepper, Step, StepLabel } from '@mui/material'
import { Grid, styled, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import CreatePassword from './CreatePassword'
import ShowSeed from './ShowSeed'
import CreateWallet from './CreateWallet'
import { Close } from '@mui/icons-material'
import { passwordRules, confirmPasswordRules } from './CreatePassword'
import { useFormInputValidator } from '../../hooks'
import { keystore } from 'eth-lightwallet'
import _isEqual from 'lodash/isEqual'
import { getLoading, isGenerateKeystoreSuccess } from '../../selectors/keystore'

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
    onCreateWallet: () => void,
    onClose: () => void,
}

export default function CreateWalletModal({ open, onCreateWallet, onClose } : CreateWalletModalProps) {

    const dispatch = useDispatch()

    const [activeStep, setActiveStep] = useState<number>(0)

    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const [isPasswordDirty, errorPassword, handleBlurPassword] = useFormInputValidator(passwordRules, [password], [password])
    const [isConfirmPasswordDirty, errorConfirmPassword, handleBlurConfirmPassword] = useFormInputValidator(confirmPasswordRules, [confirmPassword, password], [confirmPassword])

    const [seedInfo, setSeedInfo] = useState<Array<{ name: string, index: number }>>([])

    const walletCreated = useSelector(isGenerateKeystoreSuccess)
    const loading = useSelector(getLoading)

    const onClickWord = (seedInfo: Array<{ name: string, index: number }>) => {
        setSeedInfo(seedInfo)
    }

    const handleOnContinue = () => {
        if (activeStep < 2) {
            setActiveStep(activeStep + 1)
        } else {
            dispatch(keystoreActions.generate({
                password,
                seedPhrase: seed.join(' '),
                hdPathString: 'm/44\'/60\'/0\'/0',
            }))
        }
    }

    useEffect(() => {
       if (walletCreated && onCreateWallet) {
           onCreateWallet()
       }
    }, [walletCreated, onCreateWallet])

    const seed = useMemo(() => {
        const seed = keystore.generateRandomSeed()
        return seed.split(' ')
    }, [])

    const equalSeeds = useMemo(() => {
        if (seed.length !== seedInfo.length) {
            return false
        }
        return _isEqual(
            seed,
            seedInfo.map(seed => seed.name)
        )
    }, [seed, seedInfo])

    const buttonDisabled = activeStep === 0 ?
        !isPasswordDirty || errorPassword.has || !isConfirmPasswordDirty || errorConfirmPassword.has : activeStep === 2 ?
            !equalSeeds : false

    return (
        <Dialog open={open} fullWidth={true} maxWidth='sm' scroll='paper'>
            <DialogTitleStyled>
                <div/>
                <div>Create Wallet</div>
                <IconButton
                    aria-label='close'
                    onClick={onClose}
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
                <LoadingButton
                    sx={{ mr:1 }}
                    disabled={buttonDisabled}
                    loading={loading}
                    onClick={handleOnContinue}>
                    { activeStep < 2 ? 'Continue' : 'Confirm' }
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}