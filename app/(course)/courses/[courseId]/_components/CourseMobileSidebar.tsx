import React from 'react'
import { Menu } from 'lucide-react'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CourseSidebar } from '.'


interface CourseMobileSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[]
    }
    progressCount: number
}

const CourseMobileSidebar = async ({ course, progressCount }: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
                <Menu />
            </SheetTrigger>
            <SheetContent className='p-0 bg-white w-72' side={'left'}>
                <CourseSidebar course={course} progressCount={progressCount} />
            </SheetContent>
        </Sheet>
    )
}

export default CourseMobileSidebar