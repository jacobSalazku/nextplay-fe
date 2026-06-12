import { memo, useState } from 'react';
import { useWeeklyTeamAverages } from '../../hooks/use-weekly-team-averages';
import { calculateShootingPercentages } from '../../utils/shooting-percentage';
import { useTeam } from '@/context/team-context';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TeamStats } from '@/graphql/graphql';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/foundation/button/button';

type TeamPerformanceChartProps = {
  title: string;
  teamStatlist: TeamStats;
};

const TeamPerformanceChart = memo(function TeamPerformanceChart({
  title,
  teamStatlist,
}: TeamPerformanceChartProps) {
  const { routeKey } = useTeam();
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;

  const { weeklyTeamAverages } = useWeeklyTeamAverages({
    routeKey,
  });

  const paginatedData = weeklyTeamAverages.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage,
  );

  const totalItems = weeklyTeamAverages.length;

  const handlePrevPage = () => {
    setPage((currentPage) => Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setPage((currentPage) =>
      (currentPage + 1) * itemsPerPage < totalItems
        ? currentPage + 1
        : currentPage,
    );
  };
  const percentages = calculateShootingPercentages(teamStatlist);

  const chartData = [
    {
      name: 'Team Stats',
      '2PT': percentages.twoPointsPercent, // numbers only
      '3PT': percentages.threePointsPercent,
      FT: percentages.ftPointsPercent,
    },
  ];

  return (
    <>
      <Card className="relative w-full overflow-hidden border border-orange-500/20 bg-gray-950/95 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-300/70 to-transparent" />
        <CardHeader className="py-2">
          <CardTitle className="px-2 py-3 text-2xl tracking-[0.08em] uppercase text-white">
            {title}
          </CardTitle>
          <div className="mt-2 flex justify-center space-x-4">
            <Button
              aria-label="Previous Page"
              onClick={handlePrevPage}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              aria-label="Next Page"
              onClick={handleNextPage}
              disabled={(page + 1) * itemsPerPage >= totalItems}
            >
              Next
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={paginatedData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#374151" />
              <XAxis
                dataKey="weekStart"
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
              <Line
                type="monotone"
                dataKey="averages.pointsPerGame"
                stroke="#FB923C"
                strokeWidth={3.5}
                dot={false}
                name="Points"
              />
              <Line
                type="monotone"
                dataKey="averages.assistsPerGame"
                stroke="#FDBA74"
                strokeWidth={3.5}
                dot={false}
                name="Assists"
              />
              <Line
                type="monotone"
                dataKey="averages.reboundsPerGame"
                stroke="#FED7AA"
                strokeWidth={3.5}
                dot={false}
                name="Rebounds"
              />
              <Line
                type="monotone"
                dataKey="averages.blocksPerGame"
                stroke="#FFEDD5"
                strokeWidth={3}
                dot={false}
                name="Blocks"
              />
              <Line
                type="monotone"
                dataKey="averages.stealsPerGame"
                stroke="#FFEDD5"
                strokeWidth={3}
                dot={false}
                name="Steals"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>{' '}
      <Card className="relative w-full overflow-hidden border border-orange-500/20 bg-gray-950/95 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-300/70 to-transparent" />
        <ResponsiveContainer width="100%" height={300}>
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
              formatter={(value) => `${Number(value ?? 0)}%`}
            />
            <Legend
              wrapperStyle={{
                color: '#CBD5E1',
                fontSize: '12px',
              }}
            />
            <Bar
              dataKey="3PT"
              fill="#FB923C"
              name="3 Pointers"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey={'2PT'}
              fill="#FDBA74"
              name="2 Pointers"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="FT"
              fill="#FED7AA"
              name="Free Throws"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
});

export default TeamPerformanceChart;
