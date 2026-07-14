import { db } from "@/configs/db";
import { liveUserTable } from "@/configs/schema";
import { and, eq, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { websiteId, visitorId, last_seen, url } = body;

    const parser = new UAParser(req.headers.get("user-agent") || "");
    const deviceInfo = parser.getDevice().model
      ? parser.getDevice().model
      : "Custom";
    const osInfo = parser.getOS().name ? parser.getOS().name : "Custom";
    const browserInfo = parser.getBrowser().name
      ? parser.getBrowser().name
      : "Custom";

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;

    let geoInfo: any = {};
    if (ip) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`, {
          signal: AbortSignal.timeout(5000),
        });
        geoInfo = await geoRes.json();
      } catch {
        geoInfo = {};
      }
    }

    await db
      .insert(liveUserTable)
      .values({
        visitorId,
        websiteId,
        last_seen,
        url,
        city: geoInfo.city || "Unknown",
        region: geoInfo.regionName || "Unknown",
        country: geoInfo.country || "Unknown",
        countrycode: geoInfo.countryCode || "Unknown",
        device: deviceInfo,
        os: osInfo,
        browser: browserInfo,
        lat: geoInfo.lat?.toString() || "",
        lon: geoInfo.lon?.toString() || "",
      })
      .onConflictDoUpdate({
        target: [liveUserTable.visitorId, liveUserTable.websiteId],
        set: {
          last_seen,
          city: geoInfo.city || "Unknown",
          url,
          region: geoInfo.regionName || "Unknown",
          country: geoInfo.country || "Unknown",
          countrycode: geoInfo.countryCode || "Unknown",
          device: deviceInfo,
          os: osInfo,
          browser: browserInfo,
          lat: geoInfo.lat?.toString() || "",
          lon: geoInfo.lon?.toString() || "",
        },
      });
    return NextResponse.json(
      { message: "Live user data inserted/updated successfully" },
      { headers: CORS_HEADERS },
    );
  } catch (error) {
    console.error("Error in live-user route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      headers: CORS_HEADERS,
      status:500
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const websiteId = req.nextUrl.searchParams.get("websiteId");
    console.log(`website id in route= ${websiteId}`);
    const now = Date.now();
    const activeUsers = await db
      .select()
      .from(liveUserTable)
      .where(
        and(
          gt(liveUserTable.last_seen, now - 30000),
          eq(liveUserTable.websiteId, websiteId as string),
        ),
      );
    return NextResponse.json(activeUsers, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error in live-user GET route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}
