'use client'
import { Search } from 'lucide-react'
import React from 'react'
import { Input } from './ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import qs from 'query-string'

const SearchInput = () => {
    const [value, setValue] = React.useState("")
    const debouncedValue = useDebounce(value)

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get('categoryId');

    React.useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue
            }
        }, { skipEmptyString: true, skipNull: true })

        router.push(url)
    }, [debouncedValue, currentCategoryId, router, pathname])

    return (
        <div className='relative'>
            <Search className='h-4 w-4 absolute top-3 left-3 text-slate-600' />
            <Input
                className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200'
                placeholder='Search for a course'
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}

export default SearchInput