import { View } from '@react-pdf/renderer';
import type { GetTeamStatsQuery } from '@/graphql/graphql';
import { PDFStatsCard } from './pdf-stats-card';
import { statCardStyles } from './styles/stats-card';

type TeamStats = GetTeamStatsQuery['getTeamStats'];

export function PDFTeamOverview({ teamStats }: { teamStats: TeamStats }) {
  const averages = teamStats?.averages;
  const advanced = teamStats?.advanced;

  return (
    <View>
      <View style={statCardStyles.grid}>
        <PDFStatsCard
          title="Points Per Game"
          value={averages?.pointsPerGame ?? '0'}
          subtitle={`Total Points: ${teamStats?.totalPoints ?? 0}`}
        />
        <PDFStatsCard
          title="Field Goal %"
          value={`${averages?.fieldGoalPercentage ?? 0}%`}
        />
        <PDFStatsCard
          title="3-Point %"
          value={`${averages?.threePointPercentage ?? 0}%`}
          subtitle={`3PT Made: ${averages?.threePointPercentage ?? 0}`}
        />
        <PDFStatsCard
          title="Free Throw %"
          value={`${averages?.freeThrowPercentage ?? 0}%`}
        />
        <PDFStatsCard
          title="Offensive Rating"
          value={advanced?.offensiveRating ?? '0'}
        />
        <PDFStatsCard
          title="True Shooting %"
          value={`${advanced?.trueShootingPercentage ?? '0'}%`}
        />
        <PDFStatsCard
          title="AST/TO Ratio"
          value={Number(advanced?.assistToTurnoverRatio ?? 0).toFixed(2)}
          subtitle="Assists per Turnover"
        />
        <PDFStatsCard
          title="Net Rating"
          value={advanced?.netRating ?? '0'}
          subtitle="Points scored vs allowed"
        />
      </View>
    </View>
  );
}
