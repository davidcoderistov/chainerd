import React from 'react'
import { Paper, Grid, Skeleton, Typography, } from '@mui/material'
import ListItem from './ListItem'
import AssetAllocationListItem, { AssetAllocationListItemProps } from './AssetAllocationListItem'
import _range from 'lodash/range'


export default function AssetAllocationList ({ items, loading }: { items: AssetAllocationListItemProps[], loading: boolean }) {

    return (
        <Paper sx={{ padding: '10px 30px' }} elevation={4}>
            <Grid container>
                <Grid container item wrap='nowrap' spacing={3} sx={{ padding: '15px 0' }}>
                    <Grid item xs={12}>
                        <Typography noWrap variant='body1' sx={{ fontWeight: 'bold' }}>
                            { loading ? (
                                <Skeleton variant='rectangular' width={150} />
                            ) : (
                                `Asset Allocation (${ items.length })`
                            )}
                        </Typography>
                    </Grid>
                </Grid>
                <ListItem>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        { loading ? <Skeleton variant='rectangular' /> : 'Account' }
                    </Typography>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        { loading ? <Skeleton variant='rectangular' /> : 'Address' }
                    </Typography>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        { loading ? <Skeleton variant='rectangular' /> : 'Amount' }
                    </Typography>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        { loading ? <Skeleton variant='rectangular' /> : 'Value' }
                    </Typography>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        { loading ? <Skeleton variant='rectangular' /> : 'Allocation' }
                    </Typography>
                </ListItem>
                { loading ? (
                    _range(5).map(index => (
                        <Grid key={index} container item wrap='nowrap' spacing={3} sx={{ padding: '5px 0' }}>
                            <Grid item xs={12}>
                                <Typography noWrap variant='body1' sx={{ fontWeight: 'bold' }}>
                                    <Skeleton variant='rectangular' height={30} />
                                </Typography>
                            </Grid>
                        </Grid>
                    ))
                ) : items.length > 0 ? items.map((item, index) => (
                    <AssetAllocationListItem
                        key={index}
                        account={item.account}
                        address={item.address}
                        amount={item.amount}
                        value={item.value}
                        allocation={item.allocation} />
                )) : (
                    <Grid container item wrap='nowrap' spacing={3} sx={{ padding: '15px 0', textAlign: 'center' }}>
                        <Grid item xs={12}>
                            <Typography noWrap variant='body2' color='text.secondary'>
                                No data available
                            </Typography>
                        </Grid>
                    </Grid>
                ) }
            </Grid>
        </Paper>
    )
}