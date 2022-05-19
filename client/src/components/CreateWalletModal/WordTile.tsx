import React from 'react'
import {Paper, styled} from '@mui/material'

const Container = styled(Paper)({
    minWidth: '150px',
    textAlign: 'center',
    padding: '10px 0'
})

export default function WordTile() {
    // TODO: Extract word as a prop
    const word = 'entry'
    return (
        <Container variant='outlined' sx={{ color: 'primary.main' }}>
            { word }
        </Container>
    )
}