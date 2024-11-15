'use client';

import { Tables } from '@/utils/database.types';
import { format, subDays } from 'date-fns';
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface EngagementChartProps {
  analytics: Tables<'campaign_analytics'>[];
}

export function EngagementChart({ analytics }: EngagementChartProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const opens = analytics.filter(a => 
      a.opened_at && format(new Date(a.opened_at), 'yyyy-MM-dd') === dateStr
    ).length;
    const clicks = analytics.filter(a => 
      a.clicked_at && format(new Date(a.clicked_at), 'yyyy-MM-dd') === dateStr
    ).length;

    return {
      date: dateStr,
      opens,
      clicks,
    };
  }).reverse();

  const chartConfig = {
    opens: {
      label: "Opens",
      color: "hsl(var(--chart-1))"
    },
    clicks: {
      label: "Clicks",
      color: "hsl(var(--chart-2))"
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <LineChart data={last7Days}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickFormatter={(value) => format(new Date(value), 'MMM d')}
        />
        <YAxis 
          stroke="hsl(var(--foreground))"
          fontSize={12}
        />
        <ChartTooltip />
        <ChartLegend />
        <Line
          type="monotone"
          dataKey="opens"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
} 