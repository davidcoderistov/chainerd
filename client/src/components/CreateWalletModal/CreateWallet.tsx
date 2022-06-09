import React, { useMemo } from 'react'
import { Typography, styled } from '@mui/material'
import SeedInfo from '../SeedInfo'
import _shuffle from 'lodash/shuffle'

const Header = styled(Typography)({
    marginBottom: '15px'
})

interface CreateWalletStepProps {
    seed: Array<string>,
    seedInfo: Array<{ name: string, index: number }>,
    onClickWord: (seedInfo: Array<{ name: string, index: number }>) => void,
}

export default function CreateWallet({ seed, seedInfo, onClickWord } : CreateWalletStepProps) {

    const handleOnClickWord = (index: number, shouldBeAdded: boolean) => {
        if (shouldBeAdded) {
            onClickWord([...seedInfo, { name: randomSeed[index], index, }])
        } else {
            onClickWord(seedInfo.filter(seed => seed.index !== index))
        }
    }

    const randomSeed = useMemo(() => _shuffle(seed), [seed])

    return (
        <React.Fragment>
            <Header
                variant='body1'
            >
                Please select each phrase in order to make sure that the secret recovery phrase is correct.
            </Header>
            <SeedInfo
                style={{ marginBottom: '30px' }}
                seed={seedInfo.map(seed => seed.name)}/>
            <SeedInfo
                seed={randomSeed}
                actionable
                onClickWord={handleOnClickWord}/>
        </React.Fragment>
    )
}