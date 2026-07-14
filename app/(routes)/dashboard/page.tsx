"use client"
import { Button } from "@/components/ui/button";
import { WebsiteInfoType, WebsiteType } from "@/type";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react"
import WebsiteCard from "./_components/WebsiteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";


function Dashbaord(){
    const [WebsiteList, setWebsiteList] = useState<WebsiteInfoType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        getUserWebsites();
    },[]);

    const getUserWebsites = async()=>{
        try{
            setLoading(true);
            const now = new Date();
            const todayStart = format(now, "yyyy-MM-dd'T'00:00:00xxx");
            const todayEnd = format(now, "yyyy-MM-dd'T'23:59:59xxx");
            const result = await axios.get(
                `/api/website?from=${encodeURIComponent(todayStart)}&to=${encodeURIComponent(todayEnd)}`
            );
            console.log(result.data);
            setWebsiteList(result?.data);
            setLoading(false);
        }
        catch(err){
            console.log(err);
            setError("Failed to load websites. Please try again.");
            setLoading(false);
        }
    }
    return(<div className="mt-2">
            <div className=" flex justify-between items-center pt-2">
                <h1 className="text-xl">My Websites</h1>
                <Link href={'/dashboard/new'}>
                    <Button className="cursor-pointer">+ Website</Button>
                </Link>
            </div>
            <div>
                <div>
                    {loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {[1,2,3,4].map((item, index)=>{
                        return(
                            <div key={index} className='border p-4'>
                                <div className="flex items-center gap-4 p-4">
                                    <Skeleton className="h-8 w-8 rounded-sm"/>
                                    <Skeleton className="h-4 w-1/2 rounded-sm mt-2"/>
                                </div>
                                <Skeleton className="h-[80px] w-full mt-4"/>
                            </div>
                        )
                    })}
                    </div>}
                </div>
                {error && (
                    <div className="text-red-500 p-4 border border-red-300 rounded mt-4">
                        {error}
                    </div>
                )}
                {!loading&&WebsiteList?.length===0?
                <div className="flex flex-col justify-center items-center gap-4 p-8 border-2 border-dashed rounded-xl mt-2">
                    <Image src={'/website.png'} alt='website' width={100} height={100}/>
                    <h2>Please add a website to start tracking</h2>
                    <Link href={'/dashboard/new'}>
                    <Button className="cursor-pointer">+ Website</Button>
                    </Link>
                    
                    
                </div>:
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                    {WebsiteList?.map((website, index) => {
                        return(<WebsiteCard key={index} websiteInfo={website}/>)
                    })}
                </div>
                }
            </div>
        </div>)
}

export default Dashbaord;
