'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const roleChartData = [
  { period: "H2 2022", strategy: 10, problemDiscovery: 30, solutionDiscovery: 55, implementation: 5 },
  { period: "H1 2023", strategy: 10, problemDiscovery: 35, solutionDiscovery: 50, implementation: 5 },
  { period: "H2 2023", strategy: 15, problemDiscovery: 40, solutionDiscovery: 38, implementation: 7 },
  { period: "H1 2024", strategy: 18, problemDiscovery: 45, solutionDiscovery: 25, implementation: 12 },
  { period: "H2 2024", strategy: 22, problemDiscovery: 40, solutionDiscovery: 23, implementation: 15 },
  { period: "H1 2025", strategy: 25, problemDiscovery: 35, solutionDiscovery: 20, implementation: 20 },
];

const roleChartConfig = {
  strategy: {
    label: "Strategy",
    color: "#1e3a8a", // blue-800
  },
  problemDiscovery: {
    label: "Problem Discovery",
    color: "#1d4ed8", // blue-700
  },
  solutionDiscovery: {
    label: "Solution Discovery",
    color: "#3b82f6", // blue-500
  },
  implementation: {
    label: "Implementation",
    color: "#bfdbfe", // blue-200
  },
} satisfies ChartConfig;

export default function RoleEvolutionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Evolution Over Time</CardTitle>
        <CardDescription>
          How my focus shifted from hands-on execution to strategic leadership
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={roleChartConfig}>
          <BarChart accessibilityLayer data={roleChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="strategy"
              stackId="a"
              fill="var(--color-strategy)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="problemDiscovery"
              stackId="a"
              fill="var(--color-problemDiscovery)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="solutionDiscovery"
              stackId="a"
              fill="var(--color-solutionDiscovery)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="implementation"
              stackId="a"
              fill="var(--color-implementation)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <div className="flex flex-wrap justify-center gap-4 mt-4 px-6 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-800" />
          <span className="text-sm text-slate-600">Strategy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-700" />
          <span className="text-sm text-slate-600">Problem Discovery</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-sm text-slate-600">Solution Discovery & Design</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-200" />
          <span className="text-sm text-slate-600">Implementation</span>
        </div>
      </div>
    </Card>
  );
}