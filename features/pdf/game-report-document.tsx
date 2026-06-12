import { Document, Page, Text, View } from '@react-pdf/renderer';
import type {
  GetGamesWithBoxScoresQuery,
  TeamInformation,
} from '@/graphql/graphql';
import { GameCard } from './game-card';
import { PDFstyles } from './styles/document';

type GameWithBoxScore =
  GetGamesWithBoxScoresQuery['getGamesWithBoxScores'][number];

type GameReportDocumentProps = {
  game: GameWithBoxScore;
  team: TeamInformation;
  generatedAt: Date;
};

export function GameReportDocument({
  game,
  generatedAt,
  team,
}: GameReportDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={PDFstyles.page}>
        <View style={PDFstyles.header}>
          <Text style={PDFstyles.brand}>NextPlay</Text>
          <Text style={PDFstyles.headerMeta}>Game report</Text>
        </View>
        <View style={PDFstyles.hero}>
          <Text style={PDFstyles.eyebrow}>Single Game Export</Text>
          <Text style={PDFstyles.heroTitle}>{game.title}</Text>
          <Text style={PDFstyles.heroSubtitle}>
            {team.name} vs {game.opponentName} •{' '}
            {new Date(game.date).toLocaleDateString('nl-BE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Text style={PDFstyles.heroSubtitle}>
            Generated on{' '}
            {generatedAt.toLocaleDateString('nl-BE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <View style={PDFstyles.accentBar} />
        </View>
        <GameCard game={game} team={team} />
      </Page>
    </Document>
  );
}
