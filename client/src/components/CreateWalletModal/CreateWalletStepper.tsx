import React, { useState } from 'react'
import { Grid } from '@mui/material'
import { Card, CardContent, CardActions } from '@mui/material'
import { Stepper, Step, StepLabel } from '@mui/material'
import { Button } from '@mui/material'
import { styled } from '@mui/material'

const steps = [
    'Create Password',
    'Secret Recovery Phrase',
    'Create Wallet',
]

const GridStyled = styled(Grid)({
    display: ' flex',
    flexDirection: 'column',
    alignItems: 'center',
})

const CardActionsStyled = styled(CardActions)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

export default function CreateWalletStepper() {
    const [activeStep, setActiveStep] = useState(0)

    const onClickBack = () => {
        setActiveStep(activeStep - 1)
    }

    const onClickNext = () => {
        setActiveStep(activeStep + 1)
    }

    const isFirstActiveStep = activeStep === 0
    const isSecondActiveStep = activeStep === 1
    const isThirdActiveStep = activeStep === 2

    return (
        <Card>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <CardContent>
                <Grid container spacing={2}>
                    <GridStyled item md={4}>
                        { isFirstActiveStep && (
                            <div>
                                CONTENT 1
                            </div>
                        )}
                    </GridStyled>
                    <GridStyled item md={4}>
                        { isSecondActiveStep && (
                            <div>
                                CONTENT 2
                            </div>
                        )}
                    </GridStyled>
                    <GridStyled item md={4}>
                        { isThirdActiveStep && (
                            <div>
                                CONTENT 3
                            </div>
                        )}
                    </GridStyled>
                </Grid>
            </CardContent>
            <CardActionsStyled>
                <Button
                    disabled={isFirstActiveStep}
                    onClick={onClickBack}
                >
                    Back
                </Button>
                <Button
                    disabled={isThirdActiveStep}
                    onClick={onClickNext}
                >
                    Next
                </Button>
            </CardActionsStyled>
        </Card>
    )
}