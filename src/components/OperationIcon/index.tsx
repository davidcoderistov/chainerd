import React from 'react'
import { ArrowDownwardOutlined } from '@mui/icons-material'


export interface OperationIconProps {
    withdrawal: boolean
    fontSize: number
}

export default function OperationIcon ({ withdrawal, fontSize }: OperationIconProps) {

    return (
        <ArrowDownwardOutlined
            sx={{
                p: 1,
                borderRadius: '50%',
                fontSize: `${fontSize}px`,
                backgroundColor: withdrawal ? '#ffcdd2' : '#E0F2DD',
                color: withdrawal ? '#ef5350' : '#66be54',
                ...withdrawal && { transform: 'rotate(180deg)' }
        }}/>
    )
}