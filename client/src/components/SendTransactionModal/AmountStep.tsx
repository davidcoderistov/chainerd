import React, { useState, useCallback } from 'react'
import TextInput from '../TextInput'
import  { Grid, Slider, Typography, InputAdornment, styled } from '@mui/material'
import { TypographyProps, SliderProps } from '@mui/material'
import { ArrowRightAlt } from '@mui/icons-material'


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

const Label = (props: TypographyProps & { value: string }) => {
    const { variant, value } = props
    return (
        <Typography
            component='div'
            variant={variant}
            gutterBottom
            sx={{ color: '#909090' }}
        >
            { value }
        </Typography>
    )
}

interface AmountProps {
    cryptoAmount: string,
    onChangeCryptoAmount: (cryptoAmount: string) => void,
    fiatAmount: string,
    onChangeFiatAmount: (fiatAmount: string) => void,
}

const Amount = ({ cryptoAmount, onChangeCryptoAmount, fiatAmount, onChangeFiatAmount } : AmountProps) => {

    const [isCryptoAmountActive, setIsCryptoAmountActive] = useState<boolean>(false)
    const [isFiatAmountActive, setIsFiatAmountActive] = useState<boolean>(false)

    const handleOnFocusCryptoAmount = () => {
        setIsCryptoAmountActive(true)
    }

    const handleOnBlurCryptoAmount = () => {
        setIsCryptoAmountActive(false)
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
        <Grid container spacing={2} sx={{ alignItems: 'end' }}>
            <Grid item md xs={12}>
                <TextInput
                    value={cryptoAmount}
                    onChange={handleOnChangeCryptoAmount}
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
    gasPrice: SliderProps['value'],
    onChangeGasPrice: (gasPrice: SliderProps['value']) => void,
}

const GasPrice = ({ gasPrice, onChangeGasPrice } : GasPriceProps) => {

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
                    <Typography
                        component='div'
                        variant='subtitle2'
                        gutterBottom
                        sx={{ color: '#909090' }}
                    >
                        Gas Price
                    </Typography>
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
                    onChange={handleOnChangeGasPrice}
                    step={5}
                    min={40}
                    max={90}
                />
                <GasPriceContainer>
                    <Typography
                        component='div'
                        variant='subtitle2'
                        gutterBottom
                        sx={{ color: '#909090' }}
                    >
                        Slow
                    </Typography>
                    <Typography
                        component='div'
                        variant='subtitle2'
                        gutterBottom
                        sx={{ color: '#909090' }}
                    >
                        Fast
                    </Typography>
                </GasPriceContainer>
            </Grid>
        </Grid>
    )
}

const GasLimit = () => (
    <Grid container spacing={2} sx={{ alignItems: 'center', mt: 1 }}>
        <Grid item md xs={12}>
            <Label
                value='Gas Limit'
                variant='subtitle2'
            />
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

export default function AmountStep ({cryptoAmount, onChangeCryptoAmount, fiatAmount, onChangeFiatAmount, gasPrice, onChangeGasPrice } : AmountStepProps) {

    return (
        <React.Fragment>
            <Amount
                cryptoAmount={cryptoAmount}
                onChangeCryptoAmount={onChangeCryptoAmount}
                fiatAmount={fiatAmount}
                onChangeFiatAmount={onChangeFiatAmount} />
            <GasPrice
                gasPrice={gasPrice}
                onChangeGasPrice={onChangeGasPrice} />
            <GasLimit />
        </React.Fragment>
    )
}