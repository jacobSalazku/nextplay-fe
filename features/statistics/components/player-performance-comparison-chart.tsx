import { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { GetStatlineAveragesQuery } from '@/graphql/graphql';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';

type Statlines = GetStatlineAveragesQuery['getStatlineAverages'];

type PerformanceComparisonChartProps = {
  statsList: Statlines;
};

export const PerformanceComparisonChart = memo(
  function PerformanceComparisonChart({
    statsList,
  }: PerformanceComparisonChartProps) {
    const chartData = statsList?.map((player) => ({
      name: player.name,
      points: player.averages.pointsPerGame,
      assists: player.averages.assists,
      rebounds:
        Number(player.averages.offensiveRebound) +
        Number(player.averages.defensiveRebound),
      blocks: player.averages.blocks,
    }));

    return (
      <Card className="relative w-full overflow-hidden border border-orange-500/20 bg-gray-950/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-300/70 to-transparent" />
        <CardHeader>
          <CardTitle className="text-2xl tracking-[0.08em] text-white uppercase">
            Player Performance Comparison
          </CardTitle>
          <CardDescription className="text-gray-300/85">
            Top Player Statistics
          </CardDescription>
        </CardHeader>

        <ResponsiveContainer
          className="w-full px-2 pb-2"
          width="100%"
          height={320}
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#C9CED6"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#C9CED6"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(251,146,60,0.35)',
                borderRadius: '12px',
                color: '#F8FAFC',
              }}
            />
            <Legend
              wrapperStyle={{
                color: '#CBD5E1',
                fontSize: '12px',
              }}
            />
            <Bar
              dataKey="points"
              fill="#FB923C"
              name="Points"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="assists"
              fill="#FDBA74"
              name="Assists"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="rebounds"
              fill="#FED7AA"
              name="Rebounds"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="blocks"
              fill="#FFEDD5"
              name="Blocks"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  },
);
