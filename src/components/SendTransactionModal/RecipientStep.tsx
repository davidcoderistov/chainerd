import React, { useCallback } from 'react'
import TextInput  from '../TextInput'
import { Divider, MenuItem, styled } from '@mui/material'
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
    addresses: string[],
    fromAddress: string,
    onChangeFromAddress: (fromAddress: string) => void,
    toAddress: string,
    onChangeToAddress: (toAddress: string) => void,
}

export default function RecipientStep ({ addresses, fromAddress, onChangeFromAddress, toAddress, onChangeToAddress }: RecipientStepProps) {

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

    const emptyText = 'Please generate an address before trying to send a transaction'

    return (
        <React.Fragment>
            <TextInput
                value={addresses.length > 0 ? fromAddress : emptyText}
                onChange={handleOnChangeFromAddress}
                inputLabel='Account to debit'
                placeholder='Enter sender address'
                select
                disabled={addresses.length <= 0}
                fullWidth>
                { addresses.length > 0 ? addresses.map(address => (
                    <MenuItem key={address} value={address}>
                        { address }
                    </MenuItem>
                )) : (
                    <MenuItem value={emptyText}>
                        { emptyText }
                    </MenuItem>
                )}
            </TextInput>
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