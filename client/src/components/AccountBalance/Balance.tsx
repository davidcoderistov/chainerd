import React from 'react'
import { Typography, IconButton, styled } from '@mui/material'
import { SwapVert } from '@mui/icons-material'
import AnimatedNumbers from 'react-animated-numbers'

const BalanceContainer = styled('div')({
    display: 'inline-flex',
    flexDirection: 'row',
    columnGap: '10px',
    cursor: 'pointer',
    paddingRight: '10px',
    '&:hover': {
        backgroundColor: 'rgba(220,220,220,0.07)'
    }
})

const IconContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
})

const SwapButton = styled(IconButton)({
    color: '#adb5bd',
    '&:hover': {
        color: '#1976D9',
    }
})

export interface BalanceProps {
    balance: number
    fiat: boolean
    onChangeBalanceView: () => void
}

export default function Balance ({ balance, fiat, onChangeBalanceView }: BalanceProps) {

    const handleOnClick = () => {
        onChangeBalanceView()
    }

    return (
        <BalanceContainer onClick={handleOnClick}>
            <IconContainer>
                <SwapButton size='small'>
                    <SwapVert />
                </SwapButton>
            </IconContainer>
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: fiat ? '1px' : '5px' }}>
                    { fiat && (
                        <span style={{ fontSize: 32, fontWeight: 'bold' }}>$</span>
                    )}
                    <AnimatedNumbers
                        animateToNumber={balance}
                        fontStyle={{ fontSize: 32, fontWeight: 'bold' }}
                        // @ts-ignore
                        configs={(number: number, index: number) => {
                            return {
                                mass: 1,
                                tension: 230 * (index + 1),
                                friction: 80
                            };
                        }}
                    />
                    { !fiat && (
                        <div style={{ fontSize: 22, fontWeight: 'bold' }}>ETH</div>
                    )}
                </div>
                <Typography variant='subtitle2' color='#adb5bd'>
                    total balance
                </Typography>
            </div>
        </BalanceContainer>
    )
}