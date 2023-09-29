import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser()
        console.log("🚀 ~ file: route.ts:7 ~ POST ~ user:", user)

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) return new NextResponse("Unauthorized", { status: 401 })

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true
            }
        });

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        })

        if (purchase) return new NextResponse("Already purchase", { status: 400 })

        if (!course) return new NextResponse("Course not found", { status: 404 })

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: course.title,
                        description: course.description!
                    },
                    unit_amount: Math.round(course.price! * 100)
                }
            }
        ];

        let striperCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                striperCustomerId: true
            }
        })

        if (!striperCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress
            })

            striperCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    striperCustomerId: customer.id
                }
            })
        }

        const session = await stripe.checkout.sessions.create({
            customer: striperCustomer.striperCustomerId,
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('[COURSE_ID_CHECKOUT]', error)
        return new NextResponse("internal error", { status: 500 })
    }
}