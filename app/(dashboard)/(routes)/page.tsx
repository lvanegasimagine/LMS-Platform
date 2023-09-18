import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Home = () => {
    return (
        <div className='flex justify-end items-center mt-10 px-10'>
            <UserButton afterSignOutUrl='/' />
        </div>
    )
}

export default Home