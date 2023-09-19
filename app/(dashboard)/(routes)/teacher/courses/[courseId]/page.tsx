import React from 'react'

const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
    return (
        <div>Params: {params.courseId}</div>
    )
}

export default CourseIdPage