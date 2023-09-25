import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!course) return new NextResponse("Not Found", { status: 404 })

        const unpublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            }, data: {
                isPublished: false
            }
        })

        return NextResponse.json(unpublishedCourse)

    } catch (error) {
        console.error('[COURSE_ID_UNPUBLISH]', error)
        return new NextResponse("internal error", { status: 500 })
    }
}