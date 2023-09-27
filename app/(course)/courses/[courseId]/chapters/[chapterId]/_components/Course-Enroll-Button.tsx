import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import React from 'react'

interface CourseEnrollButtonProps {
    courseId: string,
    price: number
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
    return (
        <Button className='w-full md:w-auto' size={'sm'}>Enroll for {formatPrice(price)}</Button>
    )
}

export default CourseEnrollButton