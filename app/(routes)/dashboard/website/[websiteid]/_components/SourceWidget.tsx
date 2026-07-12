import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsType } from "@/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import SourceWidgetSkeleton from "./_skeletons/WidgetSkeleton";

type Props = {
  websiteAnalytics: AnalyticsType | undefined;
  loading: boolean;
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

function SourceWidget({ websiteAnalytics, loading }: Props) {
  return (
    <div>
      {loading ? <SourceWidgetSkeleton /> : (
      <Card>
        <CardContent className="p-5">
          <Tabs defaultValue="source" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="source">Source</TabsTrigger>
              <TabsTrigger value="refParams">Referral Parameters</TabsTrigger>
            </TabsList>
            <TabsContent value="source">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={websiteAnalytics?.referrals}
                  layout="vertical"
                  margin={{
                    right: 16,
                  }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="domainName"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <XAxis dataKey="uv" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar
                    dataKey="uv"
                    fill="var(--color-primary)"
                    radius={4}
                    opacity={0.7}
                  >
                    <LabelList
                      dataKey="domainName"
                      position="insideLeft"
                      offset={8}
                      className="fill-(--color-label)"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="refParams">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={websiteAnalytics?.refParams}
                  layout="vertical"
                  margin={{
                    right: 16,
                  }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <XAxis dataKey="uv" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar
                    dataKey="uv"
                    fill="var(--color-primary)"
                    radius={4}
                    opacity={0.7}
                  >
                    <LabelList
                      dataKey="name"
                      position="insideLeft"
                      offset={8}
                      className="fill-(--color-label)"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>)}
    </div>
  );
}

export default SourceWidget;
