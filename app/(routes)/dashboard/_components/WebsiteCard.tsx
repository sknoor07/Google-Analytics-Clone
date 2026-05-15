import React from 'react'
import { WebsiteType } from '@/type'
import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const WebsiteCard = ({website}: {website: WebsiteType}) => {
  const cleanDomain = website?.domain.replace(/^https?:\/\/(www\.)?/, "");
    const shortdomain = cleanDomain.length > 25 ? cleanDomain.slice(0, 25).concat("...") : cleanDomain;
  const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]
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
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
        <h2 className='text-sm mt-1'> <strong>24</strong > Visitors</h2>
        </CardContent>
        
      </Card>
    </div>
  )
}

export default WebsiteCard;