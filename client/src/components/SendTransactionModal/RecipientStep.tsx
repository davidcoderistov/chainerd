import React, { useCallback } from 'react'
import TextInput  from '../TextInput'
import { Divider, styled } from '@mui/material'
import { ArrowDownwardOutlined } from '@mui/icons-material'

const DividerContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '20px 0',
})

const StyledDivider = styled(Divider)({
    flex: '1 1 auto',
})

const DownArrowIcon = styled(ArrowDownwardOutlined)({
    borderRadius: '50%',
    border: '1px solid gainsboro',
})

interface RecipientStepProps {
    fromAddress: string,
    onChangeFromAddress: (fromAddress: string) => void,
    toAddress: string,
    onChangeToAddress: (toAddress: string) => void,
}

export default function RecipientStep ({ fromAddress, onChangeFromAddress, toAddress, onChangeToAddress }: RecipientStepProps) {

    const handleOnChangeFromAddress = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeFromAddress(event.target.value)
        },
        [onChangeFromAddress]
    )

    const handleOnChangeToAddress = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeToAddress(event.target.value)
        },
        [onChangeToAddress]
    )

    return (
        <React.Fragment>
            <TextInput
                value={fromAddress}
                onChange={handleOnChangeFromAddress}
                inputLabel='Account to debit'
                placeholder='Enter sender address'
                fullWidth/>
            <DividerContainer>
                <StyledDivider />
                <DownArrowIcon
                    color='primary'
                    fontSize='small'
                    sx={{ p:1 }}/>
                <StyledDivider />
            </DividerContainer>
            <TextInput
                value={toAddress}
                onChange={handleOnChangeToAddress}
                inputLabel='Recipient address'
                placeholder='Enter recipient address'
                fullWidth/>
        </React.Fragment>
    )
}