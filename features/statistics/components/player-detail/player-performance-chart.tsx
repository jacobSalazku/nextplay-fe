import { useState, type FC } from 'react';
import { useStatsPerGame } from '../../hooks/use-stats-per-game';
import { fallbackData } from '../../utils/constants';
import type { PlayerStatRow } from '../../utils/types';
import { useTeam } from '@/context/team-context';
import { capitalizeFirstLetter } from '@/utils/capital-first-letter';
import { ChevronLeft } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/foundation/button/button';

type PlayerPerformanceChartProps = {
  player: PlayerStatRow;
  title: string;
};

export const PlayerPerformanceChart: FC<PlayerPerformanceChartProps> = ({
  player,
  title,
}) => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { routeKey } = useTeam();

  const { statsPerGame } = useStatsPerGame({
    memberId: player.memberId,
    year,
    month,
    routeKey,
  });

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const statsDate = capitalizeFirstLetter(
    new Date(year, month - 1).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    }),
  );

  const isNextDisabled =
    year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <Card className="relative overflow-hidden border border-orange-500/20 bg-gray-950/95 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-300/70 to-transparent" />
      <div className="flex items-center justify-center gap-4 py-2">
        <Button onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4 text-orange-300" />
        </Button>
        <span className="text-lg font-bold text-white">{statsDate}</span>
        <Button onClick={nextMonth} disabled={isNextDisabled}>
          <ChevronLeft className="h-4 w-4 rotate-180 text-orange-300" />
        </Button>
      </div>
      <CardHeader className="py-2">
        <CardTitle className="px-2 py-3 text-2xl tracking-[0.08em] text-white uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={statsPerGame.length > 0 ? statsPerGame : fallbackData}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#374151" />
            <XAxis
              dataKey="gameTitle"
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
              dataKey="points"
              stroke="#FB923C"
              strokeWidth={3.5}
              dot={false}
              name="Points"
            />
            <Line
              type="monotone"
              dataKey="assists"
              stroke="#FDBA74"
              strokeWidth={3.5}
              dot={false}
              name="Assists"
            />
            <Line
              type="monotone"
              dataKey="rebounds"
              stroke="#FED7AA"
              strokeWidth={3.5}
              dot={false}
              name="Rebounds"
            />
            <Line
              type="monotone"
              dataKey="steals"
              stroke="#FFEDD5"
              strokeWidth={3}
              dot={false}
              name="Steals"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
