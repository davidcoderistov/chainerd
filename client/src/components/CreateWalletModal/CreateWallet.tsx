import React, { useState, useMemo } from 'react'
import { Typography, styled } from '@mui/material'
import SeedInfo from './SeedInfo'
import _shuffle from 'lodash/shuffle'

const Header = styled(Typography)({
    marginBottom: '15px'
})

interface CreateWalletStepProps {
    seed: Array<string>,
}

export default function CreateWallet({ seed } : CreateWalletStepProps) {

    const [seedInfo, setSeedInfo] = useState<Array<{ name: string, index: number }>>([])

    const handleOnClickWord = (index: number, shouldBeAdded: boolean) => {
        if (shouldBeAdded) {
            setSeedInfo([...seedInfo, { name: randomSeed[index], index, }])
        } else {
            setSeedInfo(seedInfo.filter(seed => seed.index !== index))
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