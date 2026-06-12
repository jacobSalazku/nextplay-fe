import { StyleSheet } from '@react-pdf/renderer';

export const statCardStyles = StyleSheet.create({
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  card: {
    width: '48%', // fits two per row in PDF; adjust for more/less
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#111827',
    marginBottom: 10,
  },
  title: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fb923c',
  },
  subtitle: {
    fontSize: 8,
    color: '#d1d5db',
    marginTop: 2,
  },
});
