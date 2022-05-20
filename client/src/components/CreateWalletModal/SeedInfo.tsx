import React from 'react'
import { Paper, Button, styled } from '@mui/material'

const Container = styled(Paper)(props => ({
    display: 'grid',
    gridTemplateRows: 'repeat(3, 45px)',
    gridTemplateColumns: 'repeat(4, 150px)',
    rowGap: '10px',
    columnGap: '10px',
    width: props.variant ? '630px' : '670px',
    height: props.variant ? '155px' : '195px',
    padding: props.variant && '20px'
}))

const Word = styled(Paper)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '150px',
    height: '45px'
})

interface SeedInfoProps {
    seed: Array<string>,
    actionable?: boolean,
    onClickWord?: (index: number) => {},
}

export default function SeedInfo({ seed, actionable, onClickWord }: SeedInfoProps) {

    return (
        <React.Fragment>
            { actionable ? (
                <Container elevation={0}>
                    { seed.map((word, index) => (
                        <Button
                            key={`actionable-${index}`}
                            variant='contained'
                            onClick={() => {
                                if (onClickWord) {
                                    onClickWord(index)
                                }
                            }}
                        >
                            { word }
                        </Button>
                    ))}
                </Container>
            ) : (
                <Container variant='outlined'>
                    { seed.map((word, index) => (
                        <Word
                            key={`static-${index}`}
                            variant='outlined'
                            sx={{ color: 'primary.main', }}
                        >
                            { word }
                        </Word>
                    ))}
                </Container>
            )}
        </React.Fragment>
    )
}