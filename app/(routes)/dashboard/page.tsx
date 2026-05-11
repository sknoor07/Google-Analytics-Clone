"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react"

function Dashbaord(){
    const [WebsiteList, setWebsiteList] = useState([]);
    return(<div className="mt-2">
            <div className=" flex justify-between items-center pt-2">
                <h1 className="text-xl">My Websites</h1>
                <Button className="cursor-pointer">+ Website</Button>
            </div>
            <div>
                {WebsiteList?.length===0?
                <div className="flex flex-col justify-center items-center gap-4 p-8 border-2 border-dashed rounded-xl mt-2">
                    <Image src={'/website.png'} alt='website' width={100} height={100}/>
                    <h2>Please add a website to start tracking</h2>
                    <Button className="cursor-pointer">+ Website</Button>
                </div>:
                <div>
                    {WebsiteList}
                </div>
                }
            </div>
        </div>)
}

export default Dashbaord;
