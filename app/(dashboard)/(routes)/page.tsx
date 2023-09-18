import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Home = () => {
    return (
        <>
            <UserButton afterSignOutUrl='/' />
        </>
    )
}

export default Home