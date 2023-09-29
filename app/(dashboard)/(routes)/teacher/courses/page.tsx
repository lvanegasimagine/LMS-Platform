import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

const CoursesPage = async () => {
    const { userId } = auth()

    if (!userId) return redirect('/')

    const courses = await db.course.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'asc'
        }
    })


    return (
        <div className='p-6'>
            <DataTable columns={columns} data={courses} />
        </div>
    )
}

export default CoursesPage