'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WebsiteType } from "@/type";
import axios from "axios";
import { ArrowLeft, CheckCircle, Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function WebsiteSettings(){
    const params = useParams<{ websiteid?: string | string[] }>();
    const websiteId = Array.isArray(params.websiteid)
    ? params.websiteid[0]
    : params.websiteid;
    const [websiteDeatil, setWebsiteDetail]= useState<WebsiteType>();
    const router= useRouter();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

    useEffect(() => {
      if (!websiteId) return;
      getWebsiteDetails();
    }, [websiteId]);

    const getWebsiteDetails = async () => {
        try {
            const result = await axios.get(`/api/website?websiteId=${websiteId}&websiteOnly=true`);
            setWebsiteDetail(result?.data);
        } catch (error) {
            console.log('Problem with more detail api');
        }
    }

    const copyScript = async () => {
        if (!websiteDeatil?.domain) return;
        await navigator.clipboard.writeText(script);
        toast.success("Script copied successfully");
    }

   const script = websiteDeatil?.domain
     ? `<script
    defer
    data-website-id="${websiteId}"
    data-domain="${websiteDeatil.domain}"
    src="${origin}/analytics.js">
</script>`
     : "";


    return(
    <div>
        <Button className=" mt-5 cursor-pointer" onClick={()=>{ router.push(`/dashboard/website/${websiteId}`)}}>
            <ArrowLeft/> Back
        </Button>
        <h2 className="mt-2 font-bold text2xl"> Settings for {websiteDeatil?.domain.replace("https://",'')}</h2>
        <Card className="w-full mt-2">
            <CardHeader>
                <CardTitle>Script</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
                <div className='mb-3 mt-4'>
                        <p className='text-sm text-muted-foreground'>
                            Add this script inside the
                            {" "}
                            <code>{`<head>`}</code>
                            {" "}
                            of your website.
                        </p>
                    </div>

                    <div className='bg-black rounded-xl p-5 overflow-auto '>
                        <pre className='text-sm text-green-400 whitespace-pre-wrap w-full'>
                            {script || 'Loading script…'}
                        </pre>
                    </div>
                    <div className='flex justify-between'>
                    <Button
                        onClick={copyScript}
                        disabled={!websiteDeatil?.domain}
                        className='mt-5 cursor-pointer'
                    >
                        <Copy />
                        Copy Script
                    </Button>
                    <Button
                        onClick={()=>{
                            router.push('/dashboard')
                        }}
                        className='mt-5 cursor-pointer'
                    >
                        <CheckCircle />
                        Done
                    </Button>
                    </div>
            </CardContent>
        </Card>
        <Card className="mt-2 mb-5">
            <CardHeader>
                <CardTitle>Domain</CardTitle>
                <CardDescription>Your Website Domain for Analytic Tracking...</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='mb-3'>
                  {websiteDeatil?.domain ? (
                    <p className='text-sm'>{websiteDeatil.domain}</p>
                  ) : (
                    <p className='text-sm text-muted-foreground'>Loading website domain…</p>
                  )}
                </div>
                <div className="mt-3">
                    Your public WEBTRACK ID is {websiteId}
                </div>
            </CardContent>
        </Card>
    </div>)
}

export default WebsiteSettings;