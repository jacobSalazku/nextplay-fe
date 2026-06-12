import { StyleSheet } from '@react-pdf/renderer';

export const playerTableStyles = StyleSheet.create({
  table: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f97316',
    borderBottomWidth: 1,
    borderColor: '#fb923c',
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#1f2937',
    paddingVertical: 6,
    backgroundColor: '#111827',
  },
  cell: {
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
    color: '#e5e7eb',
    paddingHorizontal: 4,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
    color: '#111827',
  },
});
