export type WebsiteType={
    id:number,
    websiteId:string,
    domain:string,
    timezone:string,
    enableLocalhostTracking:boolean,
    userEmail:string,
}

export type WebsiteInfoType={
    website:WebsiteType,
    analytics:AnalyticsType,
}

export type AnalyticsType={
    browsers:BrowserType[],
    avgActiveTime:number,
    totalActiveTime:number,
    totalSessions:number,
    totalVisitors:number,
    hourlyVisitors:HourlyVisitorsType[],
    dailyVisitors:DailyVisitorsType[],
    weeklyVisitors:WeeklyVisitorsType[],
    monthlyVisitors:MonthlyVisitorsType[],
    referrals:ReferralsType[],
    refParams: RefParamsType[],
    countries: CountriesType[],
    regions:RegionType[],
    cities:CitiesType[],
    os:OsType[],
    devices:DeviceType[],
}

export type DeviceType={
    name:string,
    uv:number,
    image:string,
}
export type OsType={
    name:string,
    uv:number,
    image:string,
}

export type CitiesType={
    name:string,
    uv:number,
    image:string,
}

export type RegionType={
    name:string,
    uv:number,
    image:string,
}

export type CountriesType={
    name:string,
    uv:number,
    image:string,
}

export type RefParamsType={
    name:string,
    uv:number,
}

export type ReferralsType={
    domainName:string,
    name:string,
    uv:number,
}

export type BrowserType={
    name:string,
    uv:number,
    image:string,
}

export type WeeklyVisitorsType={
    weekStart:string,
    count:number,
}

export type MonthlyVisitorsType={
    month:string,
    count:number,
}

export type HourlyVisitorsType={
    count:number,
    date:string,
    hour:number,
    hourLabel:string,
}
export type DailyVisitorsType={
    count:number,
    date:string,
}