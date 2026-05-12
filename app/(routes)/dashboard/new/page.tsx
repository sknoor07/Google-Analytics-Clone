import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import WebsiteFrom from './_component/WebsiteFrom'
import Link from 'next/link'

export default function AddWebsite() {
    return (
        <div className=' flex items-center w-full justify-center mt-10 '>
            <div className='max-w-lg flex flex-col items-start w-full'>
                <Link href={'/dashboard'}>
                    <Button className='cursor-pointer'> <ArrowLeft />Dashbaord</Button>
                </Link>
                <div className='mt-10 w-full'>
                    <WebsiteFrom />
                </div>
            </div>
        </div>
    )
}