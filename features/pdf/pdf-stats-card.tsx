import { Text, View } from '@react-pdf/renderer';
import { statCardStyles } from './styles/stats-card';

export function PDFStatsCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <View style={statCardStyles.card}>
      <Text style={statCardStyles.title}>{title}</Text>
      <Text style={statCardStyles.value}>{value}</Text>
      {subtitle && <Text style={statCardStyles.subtitle}>{subtitle}</Text>}
    </View>
  );
}
