import { Document, Page, Text, View } from '@react-pdf/renderer';
import type {
  GetGamesWithBoxScoresQuery,
  GetStatlineAveragesQuery,
  GetTeamStatsQuery,
  TeamInformation,
} from '@/graphql/graphql';
import { GameCard } from './game-card';
import { PDFPlayerTable } from './pdf-player-stats-table';
import { PDFTeamOverview } from './pdf-team-overview';
import { PDFstyles } from './styles/document';

type TeamStats = GetTeamStatsQuery['getTeamStats'];
type PlayerStats = GetStatlineAveragesQuery['getStatlineAverages'];
type GamesWithBoxScores = GetGamesWithBoxScoresQuery['getGamesWithBoxScores'];

export function PDFDocument({
  teamStats,
  team,
  teamName,
  stats,
  gamesWithScores,
  generatedAt,
}: {
  teamStats: TeamStats;
  team: TeamInformation;
  teamName: string;
  stats: PlayerStats;
  gamesWithScores: GamesWithBoxScores;
  generatedAt: Date;
}) {
  return (
    <Document>
      <Page size="A4" style={PDFstyles.page}>
        <View style={PDFstyles.header}>
          <Text style={PDFstyles.brand}>NextPlay</Text>
          <Text style={PDFstyles.headerMeta}>Season report</Text>
        </View>
        <View style={PDFstyles.hero}>
          <Text style={PDFstyles.eyebrow}>Statistics Export</Text>
          <Text style={PDFstyles.heroTitle}>{teamName}</Text>
          <Text style={PDFstyles.heroSubtitle}>
            Team performance, player averages and box-score reports generated on{' '}
            {generatedAt.toLocaleDateString('nl-BE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <View style={PDFstyles.accentBar} />
        </View>
        <PDFTeamOverview teamStats={teamStats} />
      </Page>
      <Page size="A4" style={PDFstyles.page}>
        <Text style={PDFstyles.sectionHeader}>Player Averages</Text>
        <Text style={PDFstyles.sectionSubHeader}>
          Per-game production and core box-score indicators
        </Text>
        <PDFPlayerTable stats={stats} />
      </Page>
      <Page size="A4" style={PDFstyles.page}>
        <Text style={PDFstyles.sectionHeader}>All Games Statistics</Text>
        <Text style={PDFstyles.sectionSubHeader}>
          Completed games with saved box scores
        </Text>
        {gamesWithScores.map((game, key) => (
          <GameCard key={key} game={game} team={team} />
        ))}
      </Page>
    </Document>
  );
}
