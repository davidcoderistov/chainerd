import React from 'react'
import { Paper, Grid, Typography, } from '@mui/material'
import ListItem from './ListItem'
import AssetAllocationListItem, { AssetAllocationListItemProps } from './AssetAllocationListItem'


export default function AssetAllocationList ({ items }: { items: AssetAllocationListItemProps[] }) {

    return (
        <Paper sx={{ padding: '10px 30px' }} elevation={4}>
            <Grid container>
                <Grid container item wrap='nowrap' spacing={3} sx={{ padding: '15px 0' }}>
                    <Grid item xs={12}>
                        <Typography noWrap variant='body1' sx={{ fontWeight: 'bold' }}>
                            Asset Allocation ({ items.length })
                        </Typography>
                    </Grid>
                </Grid>
                <ListItem>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        Account
                    </Typography>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        Address
                    </Typography>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        Amount
                    </Typography>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        Value
                    </Typography>
                    <Typography noWrap variant='body2' color='text.secondary'>
                        Allocation
                    </Typography>
                </ListItem>
                { items.length > 0 ? items.map(item => (
                    <AssetAllocationListItem
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