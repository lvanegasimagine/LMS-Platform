'use client'

import React from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { File, Loader2, PlusCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Attachment, Course } from '@prisma/client'
import { FileUpload } from '@/components/file-upload'
import * as z from 'zod'
import toast from 'react-hot-toast'

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] }
    courseId: string
}

const formSchema = z.object({
    url: z.string().min(1)
})

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = React.useState<boolean>(false)
    const [deletingId, setDeletingId] = React.useState<string | null>(null)

    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current)

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success('Course updated successfully')
            toggleEdit();
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted")
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex items-center justify-between">
                Course Attachments
                <Button variant='ghost' onClick={toggleEdit}>
                    {isEditing && (
                        <> Cancel </>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add an File
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className='text-sm mt-2 text-slate-500 italic'>No attachments yet</p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className='space-y-2'>
                            {initialData.attachments.map((attachment) => (
                                <div key={attachment.id} className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'>
                                    <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                    <p className='text-xs line-clamp-1'>{attachment.name}</p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className='w-4 h-4 animate-spin' />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button className='ml-auto hover:opacity-75 transition' onClick={() => onDelete(attachment.id)}>
                                            <X className='w-4 h-4' />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload endpoint='courseAttachment' onChange={(url) => {
                        if (url) {
                            onSubmit({ url: url })
                        }
                    }} />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete
                    </div>
                </div>
            )}
        </div>
    )
}

export default AttachmentForm