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