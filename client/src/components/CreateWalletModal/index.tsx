import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, Grid } from '@mui/material'
import VerticalStepper from './VerticalStepper'
import CreatePassword from './CreatePassword'
import ShowSeed from './ShowSeed'
import CreateWallet from './CreateWallet'

interface CreateWalletModalProps {
    open: boolean,
    seed: string[],
    onCreatePassword: (password: string) => void,
    onCreateWallet: () => void,
}

export default function CreateWalletModal({ open, seed, onCreatePassword, onCreateWallet } : CreateWalletModalProps) {

    const [activeStep, setActiveStep] = useState<number>(0)

    const goNext = () => {
        setActiveStep(activeStep + 1)
    }

    const handleOnCreatePassword = (password: string) => {
        goNext()
        onCreatePassword(password)
    }

    const handleShowSeedOnNext = () => {
        goNext()
    }

    const handleOnConfirmCreateWallet = () => {
        goNext()
        onCreateWallet()
    }

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth='md'
            scroll='paper'>
                <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                    Create Wallet
                </DialogTitle>
                <DialogContent dividers={true}>
                    <Grid
                        container
                        spacing={2}
                        minHeight={500}>
                            <Grid item xs='auto'>
                                <VerticalStepper activeStep={activeStep}/>
                            </Grid>
                            <Grid item xs sx={{ mx: 4 }}>
                                { activeStep === 0 && (
                                    <CreatePassword onCreate={handleOnCreatePassword}/>
                                )}
                                { activeStep === 1 && (
                                    <ShowSeed seed={seed} onNext={handleShowSeedOnNext}/>
                                )}

                                { activeStep > 1 && (
                                    <CreateWallet seed={seed} onConfirm={handleOnConfirmCreateWallet}/>
                                )}
                            </Grid>
                    </Grid>
                </DialogContent>
        </Dialog>
    )
}