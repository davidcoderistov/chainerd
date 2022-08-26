import React, { useState, useRef, useContext } from 'react'
import { ThemeContext } from '../../config'
import { Paper, Slide, Grid, IconButton, Typography } from '@mui/material'
import AccountBalance, { AccountBalanceProps } from '../AccountBalance'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'


interface SlideViewProps {
    address: string
    onSlideLeft: () => void
    onSlideRight: () => void
    leftDisabled: boolean
    rightDisabled: boolean
}

function SlideView ({ address, onSlideLeft, onSlideRight, leftDisabled, rightDisabled, disabled }: SlideViewProps & { disabled: boolean }) {

    const { theme } = useContext(ThemeContext)

    return (
        <Grid container>
            <Grid item xs={12} container justifyContent='space-between' alignItems='center'>
                <IconButton color='primary' size='large' onClick={onSlideLeft} disabled={leftDisabled || disabled} sx={{ color: theme.main.paper.text.primary, '&.Mui-disabled': { color: theme.main.paper.text.disabled }}}>
                    <ChevronLeft />
                </IconButton>
                <div>
                    <Typography variant='h5' fontWeight='bold' color={theme.main.paper.text.primary}>
                        { address }
                    </Typography>
                    <Typography variant='subtitle2' color={theme.main.paper.text.secondary} sx={{ textAlign: 'center' }}>
                        address
                    </Typography>
                </div>
                <IconButton color='primary' size='large' onClick={onSlideRight} disabled={rightDisabled || disabled}  sx={{ color: theme.main.paper.text.primary, '&.Mui-disabled': { color: theme.main.paper.text.disabled }}}>
                    <ChevronRight />
                </IconButton>
            </Grid>
        </Grid>
    )
}

export type ViewAccountBalancesProps = SlideViewProps & AccountBalanceProps

export default function ViewAccountBalances (props: ViewAccountBalancesProps) {

    const { theme } = useContext(ThemeContext)

    const { onSlideLeft, onSlideRight } = props

    const containerRef = useRef(null)

    const [slideKey, setSlideKey] = useState<number>(1)
    const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right')

    const handleSlideLeft = () => {
        setSlideKey(slideKey + 1)
        setSlideDirection('left')
        onSlideLeft()
    }

    const handleSlideRight = () => {
        setSlideKey(slideKey + 1)
        setSlideDirection('right')
        onSlideRight()
    }

    return (
        <Paper sx={{ paddingTop: '30px', paddingBottom: '30px', minWidth: 750, backgroundColor: theme.main.paper.background }} elevation={4} ref={containerRef}>
            <Slide key={slideKey} direction={slideDirection} ref={containerRef.current} in>
                <div>
                    <SlideView
                        address={props.address}
                        leftDisabled={props.leftDisabled}
                        rightDisabled={props.rightDisabled}
                        disabled={props.chartDataLoading}
                        onSlideLeft={handleSlideLeft}
                        onSlideRight={handleSlideRight} />
                    <AccountBalance
                        sxContainer={{ paddingLeft: '30px', paddingRight: '30px' }}
                        balance={props.balance}
                        chartData={props.chartData}
                        chartDataLoading={props.chartDataLoading}
                        fiat={props.fiat}
                        periodType={props.periodType}
                        height={props.height}
                        onChangeBalanceView={props.onChangeBalanceView}
                        onChangePeriod={props.onChangePeriod} />
                </div>
            </Slide>
        </Paper>
    )
}

