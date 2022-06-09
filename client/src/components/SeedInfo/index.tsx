import React, { useState, useCallback } from 'react'
import { Paper, Button, TextField, InputAdornment, Typography, styled } from '@mui/material'

const Container = styled(Paper)(props => ({
    display: 'grid',
    gridTemplateRows: '1fr 1fr 1fr 1fr',
    gridTemplateColumns: '1fr 1fr 1fr',
    rowGap: '15px',
    columnGap: '15px',
    height: props.variant ? '230px' : '270px',
    padding: props.variant && '20px'
}))

const Word = styled(Paper)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '45px'
})

interface SeedInfoProps {
    seed: Array<string>,
    writable?: boolean,
    actionable?: boolean,
    onClickWord?: (index: number, shouldBeAdded: boolean) => void,
    onChangeWord?: (index: number, value: string) => void,
    style?: object,
}

export default function SeedInfo({ seed, writable, actionable, onClickWord, onChangeWord, style = {} }: SeedInfoProps) {

    const [indices, setIndices] = useState<{ [key: number]: boolean }>(seed.reduce((indices, word, index) => ({
        ...indices,
        [index]: false
    }), {}))

    const handleOnClick = useCallback(
        (index: number) => {
            if (onClickWord) {
                const shouldBeAdded = !indices[index]
                setIndices({
                    ...indices,
                    [index]: shouldBeAdded
                })
                onClickWord(index, shouldBeAdded)
            }
        },
        [onClickWord])

    const handleOnChange = useCallback(
        (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
            if (onChangeWord) {
                onChangeWord(index, event.target.value)
            }
        },
        [onChangeWord])

    return (
        <React.Fragment>
            { writable ? (
                <Container variant='outlined' style={style}>
                    { seed.map((word, index) => (
                        <TextField
                            key={`writable-${index}`}
                            value={word}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleOnChange(index, event)}
                            variant='standard'
                            fullWidth
                            InputProps={{
                                startAdornment:
                                    <InputAdornment position="start">
                                        <Typography
                                            variant='subtitle2'>
                                            { index + 1 }.
                                        </Typography>
                                    </InputAdornment>
                            }} />
                    ))}
                </Container>
            ) : actionable ? (
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