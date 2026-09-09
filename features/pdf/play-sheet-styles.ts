import { StyleSheet } from '@react-pdf/renderer';

const NAVY = '#1f2d4d';
const ACCENT = '#f97316';
const MUTED = '#736b57';
const RULE = '#e4dcc9';
const INK = '#1b1b1b';

export const sheet = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: INK,
    backgroundColor: '#ffffff',
  },

  wordmark: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    letterSpacing: 3,
    color: NAVY,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    color: NAVY,
    marginTop: 3,
  },
  meta: { fontSize: 9, color: MUTED, marginTop: 5, letterSpacing: 0.3 },
  metaStrong: { fontFamily: 'Helvetica-Bold', color: INK },
  rule: { height: 2, backgroundColor: NAVY, marginTop: 8, marginBottom: 4 },
  tick: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 26,
    height: 2,
    backgroundColor: ACCENT,
  },

  phase: {
    flexDirection: 'row',
    gap: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: RULE,
  },
  firstPhase: { borderTopWidth: 0 },
  court: { width: '38%' },
  tag: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    letterSpacing: 1,
    color: '#ffffff',
    backgroundColor: NAVY,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  frame: { borderWidth: 1, borderColor: RULE, padding: 3 },
  diagram: { width: '100%' },
  notes: { flex: 1, fontSize: 10, lineHeight: 1.5 },

  paragraph: { marginBottom: 5 },
  heading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: NAVY,
    marginBottom: 3,
  },
  listRow: { flexDirection: 'row', marginBottom: 2, paddingLeft: 4 },
  bullet: { width: 12, color: MUTED },
  listText: { flex: 1 },
  empty: { color: MUTED, fontFamily: 'Helvetica-Oblique' },

  foot: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: RULE,
    paddingTop: 6,
    fontSize: 8,
    color: MUTED,
  },
});
