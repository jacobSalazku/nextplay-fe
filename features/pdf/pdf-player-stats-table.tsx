import { Text, View } from '@react-pdf/renderer';
import type { GetStatlineAveragesQuery } from '@/graphql/graphql';
import { playerTableStyles } from './styles/player-table';

type PlayerStat = GetStatlineAveragesQuery['getStatlineAverages'][number];

export function PDFPlayerTable({ stats }: { stats: PlayerStat[] }) {
  return (
    <View style={playerTableStyles.table}>
      <View style={playerTableStyles.headerRow}>
        {['Player', 'GP', 'PTS', 'AST', 'REB', 'STL', 'BLK', 'TO'].map(
          (col) => (
            <Text
              style={[playerTableStyles.cell, playerTableStyles.headerCell]}
              key={col}
            >
              {col}
            </Text>
          ),
        )}
      </View>
      {stats.map((player: PlayerStat, i: number) => (
        <View style={playerTableStyles.row} key={i}>
          <Text style={playerTableStyles.cell}>{player.name ?? 'Unnamed'}</Text>
          <Text style={playerTableStyles.cell}>{player.gamesPlayed}</Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.pointsPerGame ?? 0}
          </Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.assists ?? 0}
          </Text>
          <Text style={playerTableStyles.cell}>
            {Number(player.averages?.offensiveRebound ?? 0) +
              Number(player.averages?.defensiveRebound ?? 0)}
          </Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.steals ?? 0}
          </Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.blocks ?? 0}
          </Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.turnovers ?? 0}
          </Text>
        </View>
      ))}
    </View>
  );
}
