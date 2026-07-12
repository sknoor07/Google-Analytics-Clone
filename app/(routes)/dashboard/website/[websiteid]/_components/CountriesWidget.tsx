import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsType, CountriesType, WebsiteInfoType } from "@/type";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import SourceWidgetSkeleton from "./_skeletons/WidgetSkeleton";

type Props = {
  CountriesAnalytics: AnalyticsType | undefined;
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

function CountriesWidget({ CountriesAnalytics, loading }: Props) {
  return (
    <div>
      {loading ? <SourceWidgetSkeleton /> : (
      <Card>
        <CardContent className="p-5">
          <Tabs defaultValue="countries" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="countries">Countries</TabsTrigger>
              <TabsTrigger value="city">Cities</TabsTrigger>
              <TabsTrigger value="region">Regions</TabsTrigger>
            </TabsList>
            <TabsContent value="countries">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={CountriesAnalytics?.countries}
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
            <TabsContent value="city">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={CountriesAnalytics?.cities}
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
            <TabsContent value="region">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={CountriesAnalytics?.regions}
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
      </Card>
      )}
    </div>
  );
}

export default CountriesWidget;
