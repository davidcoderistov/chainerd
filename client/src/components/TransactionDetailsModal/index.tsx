import React from 'react'
import  { Dialog, DialogContent, DialogActions } from '@mui/material'
import { Box, Grid, Typography, Button, Divider as DividerMUI } from '@mui/material'
import DialogTitle  from '../DialogTitle'
import OperationIcon from '../OperationIcon'
import moment from 'moment'


const Title = ({ children }: { children: any }) => {

    return (
        <Typography fontSize={12} fontWeight='bold' textTransform='uppercase'>
            { children }
        </Typography>
    )
}

const Subtitle = ({ children }: { children: any }) => {

    return (
        <Typography fontSize={14} color='#6c757d' sx={{ wordBreak: 'break-word' }}>
            { children }
        </Typography>
    )
}

const Divider = () => {

    return (
        <Box sx={{ width : '100%', margin: '15px 0' }}>
            <DividerMUI />
        </Box>
    )
}

export interface Transaction {
    withdrawal: boolean
    ethAmount: string
    fiatAmount: string
    account: string
    timestamp: string
    fee: string
    status: string
    blockNumber: string
    transactionHash: string
    from: string
    to: string
}

export type TransactionDetailsModalProps = {
    open: boolean
    onClose: () => void
} & Transaction

export default function TransactionDetailsModal (props: TransactionDetailsModalProps) {

    return (
        <Dialog open={props.open} fullWidth={true} maxWidth='xs' scroll='paper'>
            <DialogTitle onClose={props.onClose}>
                <Typography color='#babfc3' fontSize={13}>
                    Operation details
                </Typography>
                <Typography fontWeight='bold' fontSize={18}>
                    { props.withdrawal ? 'Sent' : 'Received' }
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ height: '550px' }}>
                    <Grid container>
                        <Grid item container xs={12} justifyContent='center' marginTop='15px'>
                            <OperationIcon withdrawal={props.withdrawal} fontSize={34} />
                        </Grid>
                        <Grid item container xs={12} justifyContent='center' marginTop='15px'>
                            <Typography color={props.withdrawal ? '#ef5350' : '#66be54'} fontSize={22}>
                                +{props.ethAmount} ETH
                            </Typography>
                        </Grid>
                        <Grid item container xs={12} justifyContent='center'>
                            <Typography color='#6c757d' fontSize={16}>
                                +${props.fiatAmount}
                            </Typography>
                        </Grid>
                        <Grid item container xs={12} marginTop='35px'>
                            <Grid item container direction='column' rowGap='5px' xs={6}>
                                <Title>
                                    Account
                                </Title>
                                <Subtitle>
                                    {props.account}
                                </Subtitle>
                            </Grid>
                            <Grid item container direction='column' rowGap='5px' xs={6}>
                                <Title>
                                    Date
                                </Title>
                                <Subtitle>
                                    {moment.unix(Number(props.timestamp)).format('DD-MM-YYYY')}
                                </Subtitle>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid item container xs={12}>
                            <Grid item container direction='column' rowGap='5px' xs={6}>
                                <Title>
                                    Fee
                                </Title>
                                <Subtitle>
                                    {props.fee} ETH
                                </Subtitle>
                            </Grid>
                            <Grid item container direction='column' rowGap='5px' xs={6}>
                                <Title>
                                    Status
                                </Title>
                                <Subtitle>
                                    { props.status === '1' ? `Confirmed (${props.blockNumber})` : 'Rejected' }
                                </Subtitle>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid item container xs={12} direction='column' rowGap='5px'>
                            <Title>
                                Transaction Hash
                            </Title>
                            <Subtitle>
                                {props.transactionHash}
                            </Subtitle>
                        </Grid>
                        <Divider />
                        <Grid item container xs={12} direction='column' rowGap='5px'>
                            <Title>
                                From
                            </Title>
                            <Subtitle>
                                {props.from}
                            </Subtitle>
                        </Grid>
                        <Divider />
                        <Grid item container xs={12} direction='column' rowGap='5px'>
                            <Title>
                                To
                            </Title>
                            <Subtitle>
                                {props.to}
                            </Subtitle>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    href={`https://kovan.etherscan.io/tx/${props.transactionHash}`}
                    sx={{ mr: 2, textTransform: 'none' }}>
                    View in explorer
                </Button>
            </DialogActions>
        </Dialog>
    )
}