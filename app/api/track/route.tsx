import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
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
  let result;
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      const rawBody = await req.text();
      console.error("Invalid JSON payload:", rawBody, parseError);
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400, headers: CORS_HEADERS },
      );
    }
    const parser = new UAParser(req.headers.get("user-agent") || "");
    const deviceInfo = parser.getDevice().vendor
      ? parser.getDevice().vendor
      : "Custom";
    const cpuInfo = parser.getCPU().architecture
      ? parser.getCPU().architecture
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

    if (body?.type !== "entry" && body?.type !== "exit") {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 },
      );
    }

    if (body?.type === "exit" && !body?.pageViewId) {
      return NextResponse.json(
        { error: "Missing pageViewId for exit event" },
        { status: 400 },
      );
    }

    if (body?.type === "entry") {
      result = await db
        .insert(pageViewTable)
        .values({
          visitorId: body.visitorId,
          pageViewId: body.pageViewId,
          websiteId: body.websiteId,
          domain: body.domain,
          type: body.type,
          entryTime: body.entryTime,
          exitTime: body.exitTime,
          totalActiveTime: body.totalActiveTime,
          referrer: body.referrer,
          url: body.url,
          urlParams: body.urlParams,
          utmsource: body.utmSource,
          utmMedium: body.utmMedium,
          utmCampaign: body.utmCampaign,
          refParams: body.RefParams,
          device: deviceInfo,
          cpu: cpuInfo,
          os: osInfo,
          browser: browserInfo,
          ip: ip || "",
          city: geoInfo.city || "",
          region: geoInfo.region || "",
          country: geoInfo.country || "",
          countryCode: geoInfo.countryCode || "",
        })
        .returning();
    } else if (body?.type === "exit") {
      result = await db
        .update(pageViewTable)
        .set({
          exitTime: body.exitTime,
          totalActiveTime: body.totalActiveTime,
          exitUrl: body.exitUrl,
        })
        .where(eq(pageViewTable.pageViewId, body.pageViewId))
        .returning();
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to track" }, { status: 500, headers: CORS_HEADERS });
  }
  return NextResponse.json(
    { message: "Tracked successfully", data: result },
    {headers:CORS_HEADERS}
  );
}
