import { db } from "@/configs/db";
import { websiteTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
    const {websiteId,domain,timezone,enableLocalhostTracking}=await req.json();

    if(!websiteId || !domain || !timezone){
        return NextResponse.json({error:"Invalid request"})
    }
    const user = await currentUser();
    const email = user?.emailAddresses[0].emailAddress;

    if(!email){
        return NextResponse.json({error:"User Email Not found while adding website"}, {status:500})
    }

    const existingDomain= await db.select().from(websiteTable).where(and(eq(websiteTable?.domain,domain),eq(websiteTable?.userEmail,email)));
    if(existingDomain.length>0){
        return NextResponse.json({message:"Website already exists",data:existingDomain[0]},{status:200})
    }

    const result= await db.insert(websiteTable).values({
        websiteId:websiteId,
        domain:domain,
        timezone:timezone,
        enableLocalhostTracking:enableLocalhostTracking,
        userEmail:email as string
    }).returning();

    return NextResponse.json({message:"Website created successfully",data:result},{status:201})
    }
    catch(error){
        return NextResponse.json({error:error},{status:500})
    }
}