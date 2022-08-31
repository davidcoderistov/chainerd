import React from 'react'
import Label from '../Label'
import { Grid, Divider, Typography, Tooltip, Link, Box, styled } from '@mui/material'
import { GridView } from '@mui/icons-material'

const AddressContainer = styled(Grid)({
    display: 'flex',
    flexDirection: 'row',
    columnGap: '15px',
})

const AddressDivider = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '10px',
    paddingTop: '5px',
    paddingBottom: '8px',
})

const GridViewIcon = styled(GridView)({
    borderRadius: '50%',
    padding: '7px',
    backgroundColor: 'rgb(239,244,254)',
})

const InfoContainer = styled(Grid)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
})

const InfoContent = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
})

const Info = ({ title, subtitle, caption, network } : { title: string, subtitle: string, caption?: string, network?: string | null }) => {

    const baseUrl = network ? `https://${network}.etherscan.io` : 'https://etherscan.io'

    return (
        <InfoContainer item xs={12}>
            <Label value={title} />
            <InfoContent>
                { caption ? (
                    <React.Fragment>
                        <Typography variant='subtitle2'>
                            { subtitle }
                        </Typography>
                        <Label value={caption} />
                    </React.Fragment>
                ) : (
                    <Tooltip title={subtitle} placement='top' arrow>
                        <Typography variant='subtitle2'>
                            <Link
                                href={`${baseUrl}/tx/${subtitle}`}
                                underline='none'>
                                { `${subtitle.slice(0, 40)}...` }
                            </Link>
                        </Typography>
                    </Tooltip>
                )}
            </InfoContent>
        </InfoContainer>
    )
}

export interface SummaryStepProps {
    fromAddress: string,
    toAddress: string,
    cryptoWithdrawAmount: string,
    fiatWithdrawAmount: string,
    cryptoFees: string,
    fiatFees: string,
    cryptoTotalAmount: string,
    fiatTotalAmount: string,
    transactionHash?: string | null,
    network: string | null
}

const toEth = (eth: string) => `${eth} ETH`
const toFiat = (fiat: string) => `$${fiat}`

export default function SummaryStep (props: SummaryStepProps) {

    const {
        fromAddress,
        toAddress,
        cryptoWithdrawAmount,
        fiatWithdrawAmount,
        cryptoFees,
        fiatFees,
        cryptoTotalAmount,
        fiatTotalAmount,
        transactionHash,
        network,
    } = props

    return (
        <React.Fragment>
            <AddressContainer item xs={12}>
                <AddressDivider>
                    <GridViewIcon
                        fontSize='small'
                        color='primary' />
                    <Divider
                        orientation='vertical'
                        sx={{ flex: '1 1 auto' }} />
                    <GridViewIcon
                        fontSize='small'
                        color='primary' />
                </AddressDivider>
                <div>
                    <Label value='From'/>
                    <Typography variant='subtitle1' sx={{ mb: 2 }}>
                        { fromAddress }
                    </Typography>
                    <Label value='To'/>
                    <Typography variant='subtitle1'>
                        { toAddress }
                    </Typography>
                </div>
            </AddressContainer>
            <Divider sx={{ mt: 1, mb: 2 }}/>
            { transactionHash && (
                <React.Fragment>
                    <Info
                        title='Transaction Hash'
                        subtitle={transactionHash}
                        network={network} />
                    <Box sx={{ my: 1 }} />
                </React.Fragment>
            )}
            <Info
                title='Amount'
                subtitle={toEth(cryptoWithdrawAmount)}
                caption={toFiat(fiatWithdrawAmount)} />
            <Info
                title='Network Fees'
                subtitle={toEth(cryptoFees)}
                caption={toFiat(fiatFees)} />
            <Divider sx={{ my: 1 }}/>
            <Info
                title='Total to debit'
                subtitle={toEth(cryptoTotalAmount)}
                caption={toFiat(fiatTotalAmount)} />
        </React.Fragment>
    )
}