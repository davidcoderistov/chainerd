import React, { useContext } from 'react'
import { ThemeContext } from '../../config'
import { Typography, IconButton, Skeleton, styled } from '@mui/material'
import { SwapVert } from '@mui/icons-material'
import AnimatedNumbers from 'react-animated-numbers'
import _isEqual from 'lodash/isEqual'

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
    '&:hover': {
        color: '#1976D9',
    }
})

export interface BalanceProps {
    balance: number
    fiat: boolean
    loading: boolean
    onChangeBalanceView: () => void
}

const Balance = React.memo(({ balance, fiat, loading, onChangeBalanceView }: BalanceProps) => {

    const { theme } = useContext(ThemeContext)

    const handleOnClick = () => {
        onChangeBalanceView()
    }

    return (
        <React.Fragment>
            { loading ? (
                <Skeleton height={60} width={120} animation='wave'/>
            ) : (
                <BalanceContainer onClick={handleOnClick}>
                    <IconContainer>
                        <SwapButton size='small' sx={{ color: theme.main.paper.text.secondary }}>
                            <SwapVert />
                        </SwapButton>
                    </IconContainer>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: fiat ? '1px' : '5px', color: theme.main.paper.text.primary }}>
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
                        <Typography variant='subtitle2' color={theme.main.paper.text.secondary}>
                            total balance
                        </Typography>
                    </div>
                </BalanceContainer>
            )}
        </React.Fragment>
    )
}, (prevProps, nextProps) => {
    return _isEqual(prevProps.balance, nextProps.balance) && _isEqual(prevProps.fiat, nextProps.fiat) && _isEqual(prevProps.loading, nextProps.loading)
})

export default Balance