import React, { useState, useCallback } from 'react'
import TextInput from '../TextInput'
import Label from '../Label'
import  { Grid, Slider, Typography, InputAdornment, styled } from '@mui/material'
import { SliderProps } from '@mui/material'
import { ArrowRightAlt } from '@mui/icons-material'
import { ErrorType } from '../../hooks'


const ArrowsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
    alignItems: 'center',
})

const RightArrow = styled(ArrowRightAlt)({
    position: 'relative',
    top: '12px',
    color: '#909090',
})

const LeftArrow = styled(ArrowRightAlt)({
    position: 'relative',
    bottom: '4px',
    transform: 'rotate(180deg)',
    color: '#909090',
})

export const ethAmountRules = [
    ([current, total]: string[]) => parseFloat(current) > parseFloat(total) && 'Sorry, insufficient funds'
]

interface AmountProps {
    cryptoAmount: string,
    onChangeCryptoAmount: (cryptoAmount: string) => void,
    onBlurCryptoAmount: () => void,
    cryptoAmountError: ErrorType,
    fiatAmount: string,
    onChangeFiatAmount: (fiatAmount: string) => void,
}

const Amount = ({ cryptoAmount, onChangeCryptoAmount, onBlurCryptoAmount, cryptoAmountError, fiatAmount, onChangeFiatAmount } : AmountProps) => {

    const [isCryptoAmountActive, setIsCryptoAmountActive] = useState<boolean>(false)
    const [isFiatAmountActive, setIsFiatAmountActive] = useState<boolean>(false)

    const handleOnFocusCryptoAmount = () => {
        setIsCryptoAmountActive(true)
    }

    const handleOnBlurCryptoAmount = () => {
        setIsCryptoAmountActive(false)
        onBlurCryptoAmount()
    }

    const handleOnFocusFiatAmount = () => {
        setIsFiatAmountActive(true)
    }

    const handleOnBlurFiatAmount = () => {
        setIsFiatAmountActive(false)
    }

    const handleOnChangeCryptoAmount = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeCryptoAmount(event.target.value)
        },
        [onChangeCryptoAmount]
    )

    const handleOnChangeFiatAmount = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeFiatAmount(event.target.value)
        },
        [onChangeFiatAmount]
    )

    return (
        <Grid container spacing={2} sx={{ alignItems: cryptoAmountError.has ? 'center' : 'end' }}>
            <Grid item md xs={12}>
                <TextInput
                    value={cryptoAmount}
                    onChange={handleOnChangeCryptoAmount}
                    error={cryptoAmountError.has}
                    helperText={cryptoAmountError.message}
                    inputLabel='Amount'
                    placeholder='0'
                    type='number'
                    size='small'
                    fullWidth
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="start">
                                <Typography
                                    variant='subtitle2'
                                    sx={{ ...isCryptoAmountActive && { color: 'primary.main' } }}>
                                    ETH
                                </Typography>
                            </InputAdornment>
                    }}
                    onFocus={handleOnFocusCryptoAmount}
                    onBlur={handleOnBlurCryptoAmount}
                />
            </Grid>
            <Grid item md='auto' xs={12}>
                <ArrowsContainer>
                    <RightArrow />
                    <LeftArrow />
                </ArrowsContainer>
            </Grid>
            <Grid item md xs={12}>
                <TextInput
                    value={fiatAmount}
                    onChange={handleOnChangeFiatAmount}
                    placeholder='0.00'
                    size='small'
                    fullWidth
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="start">
                                <Typography
                                    variant='subtitle2'
                                    sx={{ ...isFiatAmountActive && { color: 'primary.main' } }}>
                                    $
                                </Typography>
                            </InputAdornment>
                    }}
                    onFocus={handleOnFocusFiatAmount}
                    onBlur={handleOnBlurFiatAmount}/>
            </Grid>
        </Grid>
    )
}

const GasPriceContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'end',
})

interface GasPriceProps {
    lowGasPrice: number,
    highGasPrice: number,
    gasPrice: SliderProps['value'],
    onChangeGasPrice: (gasPrice: SliderProps['value']) => void,
}

const GasPrice = ({ lowGasPrice, highGasPrice, gasPrice, onChangeGasPrice } : GasPriceProps) => {

    const handleOnChangeGasPrice = useCallback(
        (event: any, value: any) => {
            onChangeGasPrice(value)
        },
        [onChangeGasPrice]
    )

    return (
        <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
                <GasPriceContainer>
                    <Label value='Gas Price' />
                    <Typography
                        component='div'
                        variant='subtitle2'
                        gutterBottom
                        sx={{ color: 'primary.main', padding: '2px 10px', backgroundColor: 'rgb(239,244,254)' }}
                    >
                        { gasPrice } Gwei
                    </Typography>
                </GasPriceContainer>
                <Slider
                    aria-label='Gas price'
                    value={gasPrice}
                    onChangeCommitted={handleOnChangeGasPrice}
                    step={1}
                    min={lowGasPrice}
                    max={highGasPrice}
                />
                <GasPriceContainer>
                    <Label value='Slow' />
                    <Label value='Fast' />
                </GasPriceContainer>
            </Grid>
        </Grid>
    )
}

const GasLimit = () => (
    <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
        <Grid item md xs={12}>
            <Label value='Gas Limit' />
        </Grid>
        <Grid item md xs={12}>
            <TextInput
                value={21000}
                type='number'
                size='small'
                aria-readonly
                fullWidth
            />
        </Grid>
    </Grid>
)

export type AmountStepProps = AmountProps & GasPriceProps

export default function AmountStep ({ cryptoAmount, onChangeCryptoAmount, onBlurCryptoAmount, cryptoAmountError, fiatAmount, onChangeFiatAmount, lowGasPrice, highGasPrice, gasPrice, onChangeGasPrice } : AmountStepProps) {
    return (
        <React.Fragment>
            <Amount
                cryptoAmount={cryptoAmount}
                onChangeCryptoAmount={onChangeCryptoAmount}
                onBlurCryptoAmount={onBlurCryptoAmount}
                cryptoAmountError={cryptoAmountError}
                fiatAmount={fiatAmount}
                onChangeFiatAmount={onChangeFiatAmount} />
            <GasPrice
                lowGasPrice={lowGasPrice}
                highGasPrice={highGasPrice}
                gasPrice={gasPrice}
                onChangeGasPrice={onChangeGasPrice} />
            <GasLimit />
        </React.Fragment>
    )
}