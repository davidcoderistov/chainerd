import React, { useState } from 'react'
import { styled } from '@mui/material'
import NavItem from './NavItem'
import { Link } from 'react-router-dom'


const StyledLink = styled(Link)({
    color: 'black',
    textDecoration: 'none',
})

export interface NavLinkProps {
    to: string
    active: boolean
    type: 'portfolio' | 'accounts'
    name: string
}

export default function NavLink ({ to, active, type, name }: NavLinkProps) {

    const [isHovered, setIsHovered] = useState(false)

    const handleOnMouseEnter = () => {
        setIsHovered(true)
    }

    const handleOnMouseLeave = () => {
        setIsHovered(false)
    }

    return (
        <StyledLink
            to={to}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
        >
            <NavItem
                active={active}
                hovered={isHovered}
                type={type}
                name={name} />
        </StyledLink>
    )
}