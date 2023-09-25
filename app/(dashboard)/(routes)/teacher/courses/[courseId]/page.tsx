import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { IconBadge } from '@/components/icon-badge'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react'
import { TitleForm, DescriptionForm, ImageForm, CategoryForm, PriceForm, AttachmentForm, ChaptersForm, Actions } from './_components'
import { Banner } from '@/components/banner'

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
    const { userId } = auth()

    if (!userId) return redirect('/')

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: 'asc'
                }
            },
            attachments: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    })

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    if (!course) return redirect('/')

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished)
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    const isComplete = requiredFields.every(Boolean)
    console.log("🚀 ~ file: page.tsx:56 ~ CourseIdPage ~ isComplete:", isComplete)

    return (
        <>
            {!course.isPublished && (
                <Banner label='This Course is unpublished. It will not be visible to the students' />
            )}
            <div className='p-6'>
                <div className='flex items-center justify-between'>
                    <div className="flex flex-col gap-y-2">
                        <h1 className='text-2xl font-medium'>Course Setup</h1>
                        <span className='text-slate-700 text-sm'>Complete all fields {completionText}</span>
                    </div>
                    <Actions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="">
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className='text-xl'>Customize your course</h2>
                        </div>
                        <TitleForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <DescriptionForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <ImageForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            options={categories.map((category) => ({ label: category.name, value: category.id }))}
                        />
                    </div>
                    <div className='space-y-6'>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">Course Chapters</h2>
                            </div>
                            <ChaptersForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className="text-xl">Sell your course</h2>
                            </div>
                            <PriceForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge icon={File} />
                                <h2 className="text-xl">Resources & Attachments</h2>
                            </div>
                            <AttachmentForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseIdPage