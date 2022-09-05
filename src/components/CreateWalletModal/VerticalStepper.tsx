import React from 'react'
import { Avatar, Typography, Divider } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { styled } from '@mui/material'


const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '10px',
    columnGap: '10px',
    height: '100%',
})

const Column = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '5px',
})

const StyledAvatar = styled(Avatar)({
    width: '25px',
    height: '25px',
})

const StyledDivider = styled(Divider)({
    flex: '1 1 auto',
})

const steps = [
    'Create Password',
    'Seed Info',
    'Create Wallet',
]

interface VerticalStepperProps {
    activeStep: number
}

export default function VerticalStepper ({ activeStep } : VerticalStepperProps) {
    return (
        <Container>
            { steps.map((step, index) => (
                <React.Fragment key={index}>
                    <Column>
                        <StyledAvatar
                            sx={{
                                bgcolor: index <= activeStep ? 'primary.main' : 'grey'
                        }}>
                            { index < activeStep ? (
                                <CheckCircle/>
                            ) : index + 1 }
                        </StyledAvatar>
                        <Typography
                            variant='overline'
                            sx={{
                                fontWeight: activeStep === index ? '600' : 'normal',
                                color: index !== activeStep ? 'gray' : undefined
                            }}>
                            { step }
                        </Typography>
                    </Column>
                    { index < 2 ? (
                        <StyledDivider orientation='vertical'/>
                    ) : null }
                </React.Fragment>
            ))}
        </Container>
    )
}