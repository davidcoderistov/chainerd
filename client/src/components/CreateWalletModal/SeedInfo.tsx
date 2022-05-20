import React, { useState } from 'react'
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
    onClickWord?: (index: number, shouldBeAdded: boolean) => void,
    style?: object,
}

export default function SeedInfo({ seed, actionable, onClickWord, style = {} }: SeedInfoProps) {

    const [indices, setIndices] = useState<{ [key: number]: boolean }>(seed.reduce((indices, word, index) => ({
        ...indices,
        [index]: false
    }), {}))

    const handleOnClick = (index: number) => {
        if (onClickWord) {
            const shouldBeAdded = !indices[index]
            setIndices({
                ...indices,
                [index]: shouldBeAdded
            })
            onClickWord(index, shouldBeAdded)
        }
    }

    return (
        <React.Fragment>
            { actionable ? (
                <Container elevation={0} style={style}>
                    { seed.map((word, index) => (
                        <Button
                            key={`actionable-${index}`}
                            variant={indices[index] ? 'contained' : 'outlined'}
                            onClick={() => handleOnClick(index)}
                        >
                            { word }
                        </Button>
                    ))}
                </Container>
            ) : (
                <Container variant='outlined' style={style}>
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