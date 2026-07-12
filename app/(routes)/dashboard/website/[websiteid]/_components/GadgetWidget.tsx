
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsType, CountriesType, WebsiteInfoType } from "@/type";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import SourceWidgetSkeleton from "./_skeletons/WidgetSkeleton";


type Props = {
  GadgetAnalytics: AnalyticsType | undefined;
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

function GadgetWidget({ GadgetAnalytics, loading }: Props) {
    return <div>
      {loading ? <SourceWidgetSkeleton /> : (
        <Card>
                <CardContent className="p-5">
                  <Tabs defaultValue="devices" className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="devices">Devices</TabsTrigger>
                      <TabsTrigger value="os">Operating Systems</TabsTrigger>
                      <TabsTrigger value="browsers">Browsers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="devices">
                      <ChartContainer config={chartConfig}>
                        <BarChart
                          accessibilityLayer
                          data={GadgetAnalytics?.devices}
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
                    <TabsContent value="os">
                      <ChartContainer config={chartConfig}>
                        <BarChart
                          accessibilityLayer
                          data={GadgetAnalytics?.os}
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
                    <TabsContent value="browsers">
                      <ChartContainer config={chartConfig}>
                        <BarChart
                          accessibilityLayer
                          data={GadgetAnalytics?.browsers}
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
        </Card>)
      }
    </div>
}

export default GadgetWidget;