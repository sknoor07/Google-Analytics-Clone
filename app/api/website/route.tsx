import { db } from "@/configs/db";
import { pageViewTable, websiteTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { toZonedTime } from "date-fns-tz";

export async function POST(req: NextRequest) {
  try {
    const { websiteId, domain, timezone, enableLocalhostTracking } =
      await req.json();

    if (!websiteId || !domain || !timezone) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 },
      );
    }
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User Email Not found while adding website" },
        { status: 500 },
      );
    }

    const existingDomain = await db
      .select()
      .from(websiteTable)
      .where(
        and(
          eq(websiteTable?.domain, domain),
          eq(websiteTable?.userEmail, email),
        ),
      );
    if (existingDomain.length > 0) {
      return NextResponse.json(
        { message: "Website already exists", data: existingDomain[0] },
        { status: 200 },
      );
    }

    const result = await db
      .insert(websiteTable)
      .values({
        websiteId: websiteId,
        domain: domain,
        timezone: timezone,
        enableLocalhostTracking: enableLocalhostTracking,
        userEmail: email as string,
      })
      .returning();

    return NextResponse.json(
      { message: "Website created successfully", data: result },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create website" },
      { status: 500 },
    );
  }
}
/* ---------------------------------------------



   SAFE timezone VALIDATOR (IANA ONLY)

--------------------------------------------- */

const getSafetimezone = (tz?: string | null) => {
  if (!tz) return "UTC";

  try {
    Intl.DateTimeFormat("en-US", { timeZone: tz });

    return tz;
  } catch {
    return "UTC";
  }
};

/* ---------------------------------------------

   TZ SAFE DATE FORMATTER (yyyy-MM-dd)

--------------------------------------------- */

const formatDateInTZ = (date: Date, timezone: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,

    year: "numeric",

    month: "2-digit",

    day: "2-digit",
  }).format(date);

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const websiteId = req.nextUrl.searchParams.get("websiteId");

  const from = req.nextUrl.searchParams.get("from");

  const to = req.nextUrl.searchParams.get("to");

  const websiteOnly = req.nextUrl.searchParams.get("websiteOnly");

  const parseDateParam = (value: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? null
      : Math.floor(parsed.getTime() / 1000);
  };

  const fromUnix = parseDateParam(from);
  const toUnix = parseDateParam(to);

  /* ---------------------------------------------

       WEBSITE ONLY

    --------------------------------------------- */

  if (websiteOnly === "true") {
    if (websiteId) {
      const websites = await db

        .select()

        .from(websiteTable)

        .where(
          and(
            eq(
              websiteTable.userEmail,

              user.primaryEmailAddress!.emailAddress,
            ),

            eq(websiteTable.websiteId, websiteId),
          ),
        );

      return NextResponse.json(websites[0]);
    }

    const websites = await db

      .select()

      .from(websiteTable)

      .where(
        eq(websiteTable.userEmail, user.primaryEmailAddress!.emailAddress),
      );

    return NextResponse.json(websites);
  }

  /* ---------------------------------------------

       FETCH WEBSITES

    --------------------------------------------- */

  const websites = await db

    .select()

    .from(websiteTable)

    .where(
      websiteId
        ? and(
            eq(
              websiteTable.userEmail,

              user.primaryEmailAddress!.emailAddress,
            ),

            eq(websiteTable.websiteId, websiteId),
          )
        : eq(
            websiteTable.userEmail,

            user.primaryEmailAddress!.emailAddress,
          ),
    )

    .orderBy(sql`${websiteTable.id} DESC`);

  const result: any[] = [];

  /* ---------------------------------------------

       FORMATTERS (UNCHANGED)

    --------------------------------------------- */

  const formatSimple = (map: Record<string, number>) =>
    Object.entries(map).map(([name, uv]) => ({ name, uv }));

  const formatWithImage = (map: Record<string, number>) =>
    Object.entries(map).map(([name, uv]) => ({
      name,

      uv,

      image: `/${name.toLowerCase()}.png`,
    }));

  const formatCountries = (
    map: Record<string, number>,

    codeMap: Record<string, string>,
  ) =>
    Object.entries(map).map(([name, uv]) => ({
      name,

      uv,

      image: codeMap[name]
        ? `https://flagsapi.com/${codeMap[name]}/flat/64.png`
        : "/country.png",
    }));

  const formatCities = (
    map: Record<string, number>,

    codeMap: Record<string, string>,
  ) =>
    Object.entries(map).map(([name, uv]) => ({
      name,

      uv,

      image: codeMap[name]
        ? `https://flagsapi.com/${codeMap[name]}/flat/64.png`
        : "/city.png",
    }));

  const formatRegions = (
    map: Record<string, number>,

    codeMap: Record<string, string>,
  ) =>
    Object.entries(map).map(([name, uv]) => ({
      name,

      uv,

      image: codeMap[name]
        ? `https://flagsapi.com/${codeMap[name]}/flat/64.png`
        : "/region.png",
    }));

  const getDomainName = (value: string) => {
    try {
      const host = new URL(
        value.startsWith("http") ? value : `https://${value}`,
      ).hostname;

      return host.replace("www.", "").split(".")[0];
    } catch {
      return value.split(".")[0];
    }
  };

  const formatReferrals = (map: Record<string, number>) =>
    Object.entries(map).map(([name, uv]) => ({
      name,

      uv,

      domainName: getDomainName(name),
    }));

  /* ---------------------------------------------

       LOOP WEBSITES

    --------------------------------------------- */

  for (const site of websites) {
    const siteTZ = getSafetimezone(site.timezone);

    const views = await db

      .select()

      .from(pageViewTable)

      .where(
        and(
          eq(pageViewTable.websiteId, site.websiteId),

          ...(fromUnix
            ? [gte(sql`${pageViewTable.entryTime}::bigint`, fromUnix)]
            : []),

          ...(toUnix
            ? [lte(sql`${pageViewTable.entryTime}::bigint`, toUnix)]
            : []),
        ),
      );

    /* ---------- UNIQUE VISITORS ---------- */

    const makeSetMap = () => ({}) as Record<string, Set<string>>;

    const countryVisitors = makeSetMap();

    const cityVisitors = makeSetMap();

    const regionVisitors = makeSetMap();

    const deviceVisitors = makeSetMap();

    const osVisitors = makeSetMap();

    const browserVisitors = makeSetMap();

    const referralVisitors = makeSetMap();

    const refParamsVisitors = makeSetMap();

    const utmSourceVisitors = makeSetMap();

    const urlVisitors = makeSetMap();

    const countryCodeMap: Record<string, string> = {};

    const cityCountryMap: Record<string, string> = {};

    const regionCountryMap: Record<string, string> = {};

    const uniqueVisitors = new Set<string>();

    let totalActiveTime = 0;

    views.forEach((v) => {
      if (!v.visitorId) return;

      uniqueVisitors.add(v.visitorId);

      if (v.totalActiveTime && v.totalActiveTime > 0) {
        totalActiveTime += v.totalActiveTime;
      }

      const add = (map: Record<string, Set<string>>, key: string) => {
        map[key] ??= new Set();

        map[key].add(v.visitorId!);
      };

      if (v.country) {
        add(countryVisitors, v.country);

        if (v.countryCode)
          countryCodeMap[v.country] = v.countryCode.toUpperCase();
      }

      if (v.city) {
        add(cityVisitors, v.city);

        if (v.countryCode) cityCountryMap[v.city] = v.countryCode.toUpperCase();
      }

      if (v.region) {
        add(regionVisitors, v.region);

        if (v.countryCode)
          regionCountryMap[v.region] = v.countryCode.toUpperCase();
      }

      if (v.device) add(deviceVisitors, v.device);

      if (v.os) add(osVisitors, v.os);

      if (v.browser) add(browserVisitors, v.browser);

      if (v.referrer) add(referralVisitors, v.referrer);

      if (v.refParams) add(refParamsVisitors, v.refParams);

      if (v.utmsource) add(utmSourceVisitors, v.utmsource);

      if (v.url) add(urlVisitors, v.url);
    });

    const toCountMap = (map: Record<string, Set<string>>) =>
      Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.size]));

    const totalVisitors = uniqueVisitors.size;

    const totalSessions = views.length;

    const avgActiveTime =
      totalVisitors > 0 ? Math.round(totalActiveTime / totalVisitors) : 0;

    /* ---------- HOURLY VISITORS ---------- */

    const hourlyMap: Record<string, Set<string>> = {};

    const hourlyVisitors: any[] = [];

    if (views.length > 0) {
      const start = fromUnix
        ? new Date(fromUnix * 1000)
        : new Date(Math.min(...views.map((v) => Number(v.entryTime) * 1000)));

      const end = toUnix
        ? new Date(toUnix * 1000)
        : new Date(Math.max(...views.map((v) => Number(v.entryTime) * 1000)));

      let cursor = new Date(start);

      while (cursor <= end) {
        const local = toZonedTime(cursor, siteTZ);

        const date = formatDateInTZ(local, siteTZ);

        const hour = local.getHours();

        const key = `${date}-${hour}`;

        hourlyVisitors.push({
          date,

          hour,

          hourLabel: local.toLocaleString("en-US", {
            hour: "numeric",

            hour12: true,

            timeZone: siteTZ,
          }),

          count: 0,
        });

        hourlyMap[key] = new Set();

        cursor.setHours(cursor.getHours() + 1);
      }

      views.forEach((v) => {
        if (!v.entryTime || !v.visitorId) return;

        const local = toZonedTime(
          new Date(Number(v.entryTime) * 1000),

          siteTZ,
        );

        const date = formatDateInTZ(local, siteTZ);

        hourlyMap[`${date}-${local.getHours()}`]?.add(v.visitorId);
      });

      hourlyVisitors.forEach((h) => {
        h.count = hourlyMap[`${h.date}-${h.hour}`]?.size || 0;
      });
    }

    /* ---------- DAILY VISITORS ---------- */

    const dailyMap: Record<string, Set<string>> = {};

    views.forEach((v) => {
      if (!v.entryTime || !v.visitorId) return;

      const local = toZonedTime(
        new Date(Number(v.entryTime) * 1000),

        siteTZ,
      );

      const date = formatDateInTZ(local, siteTZ);

      dailyMap[date] ??= new Set();

      dailyMap[date].add(v.visitorId);
    });

    const dailyVisitors = Object.entries(dailyMap).map(([date, set]) => ({
      date,

      count: set.size,
    }));

    /* ---------- WEEKLY VISITORS ---------- */

    const weeklyMap: Record<string, Set<string>> = {};

    views.forEach((v) => {
      if (!v.entryTime || !v.visitorId) return;

      const local = toZonedTime(new Date(Number(v.entryTime) * 1000), siteTZ);

      // Beginning of the week (Sunday)
      const weekStart = new Date(local);
      weekStart.setDate(local.getDate() - local.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const key = formatDateInTZ(weekStart, siteTZ);

      weeklyMap[key] ??= new Set();
      weeklyMap[key].add(v.visitorId);
    });

    const weeklyVisitors = Object.entries(weeklyMap).map(
      ([weekStart, visitors]) => ({
        weekStart,
        count: visitors.size,
      }),
    );

    /* ---------- MONTHLY VISITORS ---------- */

    const monthlyMap: Record<string, Set<string>> = {};

    views.forEach((v) => {
      if (!v.entryTime || !v.visitorId) return;

      const local = toZonedTime(new Date(Number(v.entryTime) * 1000), siteTZ);

      const month = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}`;

      monthlyMap[month] ??= new Set();
      monthlyMap[month].add(v.visitorId);
    });

    const monthlyVisitors = Object.entries(monthlyMap).map(
      ([month, visitors]) => ({
        month,
        count: visitors.size,
      }),
    );

    /* ---------- FINAL RESPONSE ---------- */

    result.push({
      website: site,

      analytics: {
        totalVisitors,

        totalSessions,

        totalActiveTime,

        avgActiveTime,

        hourlyVisitors,

        dailyVisitors,

        weeklyVisitors,
        
        monthlyVisitors,

        countries: formatCountries(
          toCountMap(countryVisitors),

          countryCodeMap,
        ),

        cities: formatCities(toCountMap(cityVisitors), cityCountryMap),

        regions: formatRegions(
          toCountMap(regionVisitors),

          regionCountryMap,
        ),

        devices: formatWithImage(toCountMap(deviceVisitors)),

        os: formatWithImage(toCountMap(osVisitors)),

        browsers: formatWithImage(toCountMap(browserVisitors)),

        referrals: formatReferrals(toCountMap(referralVisitors)),

        refParams: formatSimple(toCountMap(refParamsVisitors)),

        utmSources: formatSimple(toCountMap(utmSourceVisitors)),

        urls: formatSimple(toCountMap(urlVisitors)),
      },
    });
  }

  return NextResponse.json(result);
}


export async function DELETE(req: NextRequest) {
  try{
    const {websiteId}= await req.json();
  const user= await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

  await db.delete(websiteTable).where(and(eq(websiteTable.websiteId,websiteId),eq(websiteTable?.userEmail,email)));
  } catch(error){
    console.log(error);
  }
  
  return NextResponse.json({message:'Record Deleted Successfully'});
}
