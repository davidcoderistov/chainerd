import React from 'react'
import { Grid } from '@mui/material'


export default function ListItem ({ children }: { children: any }) {

    return (
        <Grid container item wrap='nowrap' spacing={3} sx={{ padding: '15px 0' }}>
            <Grid item xs={2}>
                { children[0] }
            </Grid>
            <Grid item xs={5}>
                { children[1] }
            </Grid>
            <Grid item xs={2}>
                { children[2] }
            </Grid>
            <Grid item xs={2}>
                { children[3] }
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                { children[4] }
            </Grid>
        </Grid>
    )
}