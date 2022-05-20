import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Stepper, Step, StepLabel } from '@mui/material'
import { Button, Typography, Grid, styled } from '@mui/material'
import CreateWalletStep from './CreateWalletStep'
import SeedInfo from "./SeedInfo";

const steps = [
    'Create Password',
    'Secret Recovery Phrase',
    'Create Wallet',
]

const StyledTypography = styled(Typography)({
    marginBottom: '15px'
})

const GridContent = styled(Grid)({
    display: 'flex',
    flexDirection: 'column',
    marginTop: '30px',
    marginLeft: '40px'
})


export default function CreateWalletModal() {
    const [activeStep, setActiveStep] = useState(0)

    const onClickNext = () => {
        setActiveStep(activeStep + 1)
    }

    const isFirstActiveStep = activeStep === 0
    const isSecondActiveStep = activeStep === 1
    const isThirdActiveStep = activeStep === 2

    const seed = ['entry', 'pattern', 'luggage', 'exotic', 'tribulations', 'snake', 'around', 'welcome', 'aboard', 'nature', 'something', 'elsewhere']

    return (
        <Dialog open={true} fullWidth={true} maxWidth='md' scroll='paper'>
            <DialogTitle sx={{ backgroundColor: 'secondary.main', color: 'white' }}>
                Create Wallet
            </DialogTitle>
            <DialogContent dividers={true}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Grid container spacing={2} minHeight={400}>
                    <GridContent item xs={12}>
                        { isFirstActiveStep && (
                            <div>
                                CONTENT 1
                            </div>
                        )}
                        { isSecondActiveStep && (
                            <React.Fragment>
                                <Grid item xs={9}>
                                    <StyledTypography
                                        variant='body1'
                                    >
                                        Your Secret Recovery Phrase makes it easy to back up and restore your account.
                                    </StyledTypography>
                                    <StyledTypography
                                        variant='body1'
                                    >
                                        Please make sure you store this phrase in a password manager, memorize it, write this phrase
                                        on a piece of paper and store in a secure location, or use any other method that you prefer.
                                    </StyledTypography>
                                    <StyledTypography
                                        variant='body1'
                                    >
                                        WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your Ether
                                        forever.
                                    </StyledTypography>
                                </Grid>
                                <SeedInfo seed={seed}/>
                            </React.Fragment>
                        )}

                        { isThirdActiveStep && (
                            <CreateWalletStep seed={seed}/>
                        )}
                    </GridContent>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isThirdActiveStep}
                    onClick={onClickNext}
                >
                    Next
                </Button>
            </DialogActions>
        </Dialog>
    )
}