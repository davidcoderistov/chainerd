import React, { useState } from 'react'
import NavItem from './NavItem'


export interface NavButtonProps {
    type: 'send' | 'delete'
    name: string
    onClick: () => void
}

export default function NavButton ({ type, name, onClick }: NavButtonProps) {

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
                active={false}
                hovered={isHovered}
                type={type}
                name={name} />
        </div>
    )
}