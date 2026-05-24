import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {UAParser} from "ua-parser-js"
export async function POST(req:NextRequest){
    let result;
    try{
   const rawBody = await req.text();
   console.log("RAW BODY:", rawBody);
   const body = JSON.parse(rawBody);
    const parser= new UAParser(req.headers.get('user-agent')||'');
    const deviceInfo= parser.getDevice().vendor?parser.getDevice().vendor:"Custom";
    const cpuInfo= parser.getCPU().architecture?parser.getCPU().architecture:"Custom";
    const osInfo= parser.getOS().name?parser.getOS().name:"Custom";
    const browserInfo= parser.getBrowser().name?parser.getBrowser().name:"Custom";
    const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()|| req.headers.get('x-real-ip')||'123.253.236.68';
    const geoRes= await fetch(`http://ip-api.com/json/123.253.236.68`);
    const geoInfo=await geoRes.json();
    
    

    // console.log("deviceInfo: ",deviceInfo)
    // console.log("cpuInfo: ",cpuInfo)
    // console.log("osInfo: ",osInfo)
    // console.log("browserInfo: ",browserInfo)
    // console.log("Ip Address: ",ip)
    // console.log("Geo Info: ",geoInfo)
    // console.log("Body Data : ",body)

    if(body?.type==="entry"){
    result = await db.insert(pageViewTable).values({
        visitorId:body.visitorId,
        websiteId:body.websiteId,
        domain:body.domain,
        type:body.type,
        entryTime:body.entryTime,
        exitTime:body.exitTime,
        totalActiveTime:body.totalActiveTime,
        referrer:body.referrer,
        url:body.url,
        urlParams:body.urlParams,
        utmsource:body.utmSource,
        utmMedium:body.utmMedium,
        utmCampaign:body.utmCampaign,
        refParams:body.RefParams,
        device:deviceInfo,
        cpu:cpuInfo,
        os:osInfo,
        browser:browserInfo,
        ip:ip||'',
        city:geoInfo.city||'',
        region:geoInfo.region||'',
        country:geoInfo.country||'',
        counrtycode:geoInfo.countryCode||'',
    }).returning();
    
    }else if(body?.type==="exit"){
        result= await db.update(pageViewTable)
        .set({
            exitTime:body.exitTime,
            totalActiveTime:body.totalActiveTime,
        })
        .where(eq(pageViewTable.visitorId,body.visitorId))
        .returning();
    }
}
    catch(error){
        return NextResponse.json({error:"Failed to track"},{status:500});
    }
    return NextResponse.json({message:"Tracked successfully",data:result},{status:200});
}