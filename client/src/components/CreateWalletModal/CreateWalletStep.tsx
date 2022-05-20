import React, { useState } from 'react'
import SeedInfo from './SeedInfo'


interface CreateWalletStepProps {
    seed: Array<string>
}

export default function CreateWalletStep({ seed } : CreateWalletStepProps) {

    const [seedInfo, setSeedInfo] = useState<Array<{ name: string, index: number }>>([])

    const handleOnClickWord = (index: number, shouldBeAdded: boolean) => {
        if (shouldBeAdded) {
            setSeedInfo([...seedInfo, { name: seed[index], index, }])
        } else {
            setSeedInfo(seedInfo.filter(seed => seed.index !== index))
        }
    }

    return (
        <React.Fragment>
            <SeedInfo
                seed={seedInfo.map(seed => seed.name)}/>
            <SeedInfo
                seed={seed}
                actionable
                onClickWord={handleOnClickWord}/>
        </React.Fragment>
    )
}