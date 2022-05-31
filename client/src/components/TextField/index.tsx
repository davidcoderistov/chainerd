import React from 'react'
import { TextField as MUITextField, Typography, TextFieldProps } from '@mui/material'


export default function TextField (props: TextFieldProps & { inputLabel: string }) {
    const { inputLabel, ...rest } = props
    return (
        <React.Fragment>
            <Typography
                component='div'
                variant='subtitle1'
                gutterBottom
                sx={{ color: 'rgb(120,153,192)'}}
            >
                { inputLabel }
            </Typography>
            <MUITextField {...rest} />
        </React.Fragment>
    )
}