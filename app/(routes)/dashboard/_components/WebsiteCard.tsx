import React from 'react'
import { WebsiteInfoType, WebsiteType } from '@/type'
import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { count } from 'console';

const WebsiteCard = ({websiteInfo}: {websiteInfo: WebsiteInfoType}) => {
  const cleanDomain = websiteInfo?.website?.domain.replace(/^https?:\/\/(www\.)?/, "");
    const shortdomain = cleanDomain.length > 25 ? cleanDomain.slice(0, 25).concat("...") : cleanDomain;
    const hourlyData= websiteInfo?.analytics?.hourlyVisitors;
    const chartData= hourlyData?.length==1?[
    {
      ...hourlyData[0],
      hour:Number(hourlyData[0].hour)-1>=0?Number(hourlyData[0].hour)-1:0,
      count:0,
      hourLabel:`${Number(hourlyData[0].hour)-1} AM/PM`
    },hourlyData[0]]: hourlyData;
  
  const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className='flex gap-2 items-center'>
              <Globe className='h-8 w-8 p-2 rounded-md bg-primary text-white ' />
              <h2 className='font-bold text-lg'>{shortdomain}</h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='max-h-20 w-full'>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            
            
            <Area
              dataKey="count"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        <h2 className='text-sm mt-1'> <strong>{websiteInfo?.analytics?.totalVisitors}</strong > Visitors</h2>
        </CardContent>
        
      </Card>
    </div>
  )
}

export default WebsiteCard;