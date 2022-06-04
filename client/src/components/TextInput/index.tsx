import React from 'react'
import { TextField , TextFieldProps, styled } from '@mui/material'
import Label from '../Label'

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
                <Label value={inputLabel} />
            )}
            { props.type === 'number' ? (
                <NumberTextField {...rest} />
            ) : (
                <TextField {...rest} />
            )}
        </React.Fragment>
    )
}