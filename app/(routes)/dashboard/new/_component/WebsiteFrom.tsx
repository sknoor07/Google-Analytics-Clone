"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Globe, Loader2Icon, Plus, SearchIcon } from "lucide-react"
import React, { useState } from "react"
import { Timezone } from "./Timezone"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { toast } from "sonner"
import { useRouter } from "next/navigation"


function WebsiteFrom(){
    const [domain, setDomain]=useState('')
    const [timezone, setTimezone]=useState('')
    const [enableLocalhostTracking, setEnableLocalhostTracking]=useState(false)
    const [loading, setLoading]=useState(false)
    
    const router= useRouter();

    const onFormSubmit=async(e:any)=>{
        const uniqueId = uuidv4();
        e.preventDefault();
        
        try{
        setLoading(true)
        const result = await axios.post('/api/website',{
            domain:`https://${domain}`,
            timezone:timezone,
            enableLocalhostTracking:enableLocalhostTracking,
            websiteId:uniqueId,
        });
        console.log(result?.data);
        setLoading(false);
        if(result?.data?.message==="Website already exists"){
            router.push(`/dashboard/new?step=script&websiteId=${result?.data?.data?.websiteId}&domain=${result?.data?.data?.domain}&old=${true}`);
        }
        if(result?.data?.message==="Website created successfully"){
            toast.success("Website created successfully");
            router.push(`/dashboard/new?step=script&websiteId=${uniqueId}&domain=${domain}&old=${false}`);
        }
    }catch(error){
        console.log(error);
        setLoading(false);
    }
    
    }
    
    return(
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Add a new Website</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                    <div className="grid grid-cols-1">
                        <form className='mt-5' onSubmit={(e)=>onFormSubmit(e)}>
                            <label className="text-sm font-bold text-muted-foreground">Website URL</label>
                            <InputGroup className="mt-2">
                                <InputGroupInput 
                                    type="text" 
                                    placeholder="www.example.com" 
                                    value={domain} 
                                    onChange={(e)=>setDomain(e.target.value)} required
                                />
                                <InputGroupAddon align="inline-start">
                                    <Globe className="text-muted-foreground" />
                                    <span> https://</span>
                                </InputGroupAddon>
                                
                            </InputGroup>
                            <div className="flex flex-col mt-5 w-full">
                                <label className="text-sm font-bold text-muted-foreground w-full">Time Zone</label>
                                <div className="mt-2"><Timezone timezone={timezone} setTimezone={setTimezone}/></div>
                            </div> 
                            <div className=" flex items-center gap-2 mt-5 w-full">
                                <Checkbox onCheckedChange={(e)=>setEnableLocalhostTracking(e as boolean)}  /> <span className="text-sm font-bold text-muted-foreground">Enable localhost tracking for development</span>
                            </div>
                            {!loading?<Button type="submit" className="w-full mt-5 cursor-pointer "><Plus /> Website</Button>:<Button disabled className="w-full mt-5 cursor-pointer "><Loader2Icon className="animate-spin" /> Website</Button>}
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default WebsiteFrom