import { StyleSheet } from '@react-pdf/renderer';

export const PDFstyles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    backgroundColor: '#030712',
    color: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#fb923c',
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fb923c',
  },
  headerMeta: {
    fontSize: 8,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  hero: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 8,
    color: '#fdba74',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 11,
    color: '#d1d5db',
  },
  accentBar: {
    marginTop: 14,
    height: 4,
    width: 120,
    borderRadius: 999,
    backgroundColor: '#f97316',
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    color: '#ffffff',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  sectionSubHeader: {
    fontSize: 9,
    color: '#9ca3af',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
