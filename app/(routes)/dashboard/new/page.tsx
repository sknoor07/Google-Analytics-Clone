"use client"
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import WebsiteFrom from './_component/WebsiteFrom'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import GeneratedScript from './_component/GeneratedScript'
import { connection } from 'next/server'

export default async function AddWebsite() {
    await connection()
    const searchParams=useSearchParams();
    const step=searchParams.get("step");

    if(step==="script"){
        return <div className=' flex items-center w-full justify-center mt-10 '>
            <div className='max-w-lg flex flex-col items-start w-full'>
                <Link href={'/dashboard'}>
                    <Button className='cursor-pointer'> <ArrowLeft />Dashbaord</Button>
                </Link>
                <div className='mt-10 w-full'>
                    <GeneratedScript />
                </div>
            </div>
        </div>
    }
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