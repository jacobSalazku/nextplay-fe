import { Text, View } from '@react-pdf/renderer';
import type {
  GetGamesWithBoxScoresQuery,
  TeamInformation,
} from '@/graphql/graphql';
import { gamesStyles } from './styles/game-card';

type GameWithBoxScore =
  GetGamesWithBoxScoresQuery['getGamesWithBoxScores'][number];

export function GameCard({
  game,
  team,
}: {
  game: GameWithBoxScore;
  team: TeamInformation;
}) {
  const teamPoints = game.teamTotals.points;
  const opponentPoints = game.opponentStats.points;

  return (
    <View style={gamesStyles.gameCard} wrap={false}>
      <View style={gamesStyles.gameHeader}>
        <Text style={gamesStyles.dateText}>
          {new Date(game.date).toLocaleString('nl-BE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={gamesStyles.label}>Box Score</Text>
      </View>
      <View style={gamesStyles.scoreBoard}>
        <View style={gamesStyles.scoreRow}>
          <Text style={gamesStyles.teamName}>{team.name}</Text>
          <Text style={[gamesStyles.scoreValue, gamesStyles.teamScoreValue]}>
            {teamPoints}
          </Text>
          <Text style={gamesStyles.dash}>–</Text>
          <Text style={gamesStyles.scoreValue}>{opponentPoints}</Text>
          <Text style={gamesStyles.opponentName}>{game.opponentName}</Text>
        </View>
      </View>
      <View style={gamesStyles.boxScoreHeader}>
        <Text style={[gamesStyles.cell, gamesStyles.playerName]}>Player</Text>
        <Text style={gamesStyles.cell}>PTS</Text>
        <Text style={gamesStyles.cell}>AST</Text>
        <Text style={gamesStyles.cell}>REB</Text>
        <Text style={gamesStyles.cell}>STL</Text>
        <Text style={gamesStyles.cell}>BLK</Text>
        <Text style={gamesStyles.cell}>TO</Text>
      </View>
      {game.playerStats.map((p, idx) => (
        <View key={idx} style={gamesStyles.boxScoreRow}>
          <Text style={[gamesStyles.cell, gamesStyles.playerName]}>
            {p.name ?? 'Unnamed'}
          </Text>
          <Text style={gamesStyles.cell}>{p.points}</Text>
          <Text style={gamesStyles.cell}>{p.assists}</Text>
          <Text style={gamesStyles.cell}>
            {(p.offensiveRebounds ?? 0) + (p.defensiveRebounds ?? 0)}
          </Text>
          <Text style={gamesStyles.cell}>{p.steals}</Text>
          <Text style={gamesStyles.cell}>{p.blocks}</Text>
          <Text style={gamesStyles.cell}>{p.turnovers}</Text>
        </View>
      ))}
    </View>
  );
}
