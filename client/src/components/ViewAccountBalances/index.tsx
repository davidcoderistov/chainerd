import React, { useState, useRef } from 'react'
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

    return (
        <Grid container>
            <Grid item xs={12} container justifyContent='space-between' alignItems='center'>
                <IconButton color='primary' size='large' onClick={onSlideLeft} disabled={leftDisabled || disabled}>
                    <ChevronLeft />
                </IconButton>
                <div>
                    <Typography variant='h5' fontWeight='bold'>
                        { address }
                    </Typography>
                    <Typography variant='subtitle2' color='#adb5bd' sx={{ textAlign: 'center' }}>
                        address
                    </Typography>
                </div>
                <IconButton color='primary' size='large' onClick={onSlideRight} disabled={rightDisabled || disabled}>
                    <ChevronRight />
                </IconButton>
            </Grid>
        </Grid>
    )
}

export type ViewAccountBalancesProps = SlideViewProps & AccountBalanceProps

export default function ViewAccountBalances (props: ViewAccountBalancesProps) {

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
        <Paper sx={{ paddingTop: '30px', paddingBottom: '30px' }} elevation={4} ref={containerRef}>
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

