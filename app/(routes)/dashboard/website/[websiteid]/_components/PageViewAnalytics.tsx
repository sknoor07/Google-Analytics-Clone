import { Card, CardContent } from "@/components/ui/card";
import type { AnalyticsType, WebsiteInfoType } from "@/type";
import LabelCountItems from "./LabelCountItems";
import { Separator } from "@/components/ui/separator";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  websiteInfo?: WebsiteInfoType | null;
  loading?: boolean;
  analyticsType?: AnalyticsType;
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function PageViewAnalytics({ websiteInfo, loading, analyticsType }: Props) {
  console.log("Website Info in PageViewAnalytics:", websiteInfo);
  const chartData =
    String(analyticsType) === "hourly"
      ? websiteInfo?.analytics?.hourlyVisitors
      : String(analyticsType) === "daily"
        ? websiteInfo?.analytics?.dailyVisitors
        : String(analyticsType) === "weekly"
          ? websiteInfo?.analytics?.weeklyVisitors
          : websiteInfo?.analytics?.monthlyVisitors;

  const xAxisKey =
    String(analyticsType) === "hourly"
      ? "hourLabel"
      : String(analyticsType) === "daily"
        ? "date"
        : String(analyticsType) === "weekly"
          ? "weekStart"
          : "month";
  return (
    <div>
      {!loading?
      <Card className="">
        <CardContent className="p-5">
          {loading ? (
            <p className="text-sm text-muted-foreground mt-2">
              Loading analytics...
            </p>
          ) : websiteInfo ? (
            <div className="flex gap-6 items-center">
              <LabelCountItems
                label="Visitors"
                value={websiteInfo.analytics?.totalVisitors ?? 0}
              />
              <Separator orientation="vertical" className="h-14" />
              <LabelCountItems
                label="Total Page Views"
                value={websiteInfo.analytics?.totalSessions ?? 0}
              />
              <Separator orientation="vertical" className="h-14" />
              <LabelCountItems
                label="Total Active Time in Minutes"
                value={Math.round(
                  Number(websiteInfo.analytics?.totalActiveTime ?? 0) / 60,
                ).toFixed(1)}
              />
              <Separator orientation="vertical" className="h-14" />
              <LabelCountItems
                label="Average Active Time in Minutes"
                value={Math.round(
                  Number(websiteInfo.analytics?.avgActiveTime ?? 0) / 60,
                ).toFixed(1)}
              />
              <Separator orientation="vertical" className="h-14" />
              <LabelCountItems
                label="Live Users"
                value={websiteInfo.analytics?.browsers?.length ?? 0}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              No analytics data available.
            </p>
          )}
        </CardContent>
        <CardContent className="p-5 mt-5">
          <ChartContainer config={chartConfig} className="h-100 w-full">
            <AreaChart
              accessibilityLayer
              data={chartData ?? []}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={
                  xAxisKey
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={
                  websiteInfo?.analytics?.totalVisitors
                    ? websiteInfo.analytics.totalVisitors + 3
                    : 3
                }
                allowDecimals={false}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="count"
                type="monotone"
                fill="var(--color-primary)"
                fillOpacity={0.4}
                stroke="var(--color-primary)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      :
      <div>
      <Skeleton className=" p-5 h-120 w-full rounded-md" />  
      </div>}
    </div>
  );
}

export default PageViewAnalytics;
