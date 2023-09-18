'use client'
import { usePathname } from 'next/navigation'
import { Layout, Compass, List, BarChart } from 'lucide-react'
import { SidebarItem } from './Sidebar-Item'

const guestRoutes = [
    { icon: Layout, label: "Dashboard", href: '/' },
    { icon: Compass, label: "Browse", href: '/search' },
]

const teacherRoutes = [
    { icon: List, label: "Courses", href: '/teacher/courses' },
    { icon: BarChart, label: "Analytics", href: '/teacher/analytics' },
]
export const SidebarRoutes = () => {
    const pathname = usePathname()
    const isTeacherPage = pathname?.includes("/teacher")
    const routes = isTeacherPage ? teacherRoutes : guestRoutes

    return (
        <div className='flex flex-col w-full'>
            {routes.map((route) => (
                <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />
            ))}
        </div>
    )
}
