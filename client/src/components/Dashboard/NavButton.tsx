import React, { useState } from 'react'
import NavItem from './NavItem'


export interface NavButtonProps {
    active: boolean
    type: 'send' | 'delete'
    name: string
    onClick: () => void
}

export default function NavButton ({ active, type, name, onClick }: NavButtonProps) {

    const [isHovered, setIsHovered] = useState(false)

    const handleOnMouseEnter = () => {
        setIsHovered(true)
    }

    const handleOnMouseLeave = () => {
        setIsHovered(false)
    }

    return (
        <div
            onClick={onClick}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            style={{ cursor: 'pointer' }}
        >
            <NavItem
                active={active}
                hovered={isHovered}
                type={type}
                name={name} />
        </div>
    )
}