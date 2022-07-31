import React from 'react'
import AnimatedNumbers from 'react-animated-numbers'

interface BalanceProps {
    balance: number
    fiat: boolean
}

export default function Balance ({ balance, fiat }: BalanceProps) {

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: fiat ? '1px' : '5px' }}>
            { fiat && (
                <span style={{ fontSize: 32, fontWeight: 'bold' }}>$</span>
            )}
            <AnimatedNumbers
                animateToNumber={balance}
                fontStyle={{ fontSize: 32, fontWeight: 'bold' }}
                // @ts-ignore
                configs={(number: number, index: number) => {
                    return {
                        mass: 1,
                        tension: 230 * (index + 1),
                        friction: 80
                    };
                }}
            />
            { !fiat && (
                <div style={{ fontSize: 22, fontWeight: 'bold' }}>ETH</div>
            )}
        </div>
    )
}