import React from 'react'
import { TextField , TextFieldProps, Typography, styled } from '@mui/material'

const NumberTextField = styled(TextField)({
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        display: 'none',
    },
    '& input[type=number]': {
        MozAppearance: 'textfield'
    },
})

export default function TextInput (props: TextFieldProps & { inputLabel?: string }) {
    const { inputLabel, ...rest } = props
    return (
        <React.Fragment>
            { inputLabel && (
                <Typography
                    component='div'
                    variant='subtitle1'
                    gutterBottom
                    sx={{ color: '#909090' }}
                >
                    { inputLabel }
                </Typography>
            )}
            { props.type === 'number' ? (
                <NumberTextField {...rest} />
            ) : (
                <TextField {...rest} />
            )}
        </React.Fragment>
    )
}