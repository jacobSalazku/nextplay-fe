import { COURT_VIEWBOX } from '@/features/playbook/components/diagram/court';
import type { PlayDiagram } from '@/features/playbook/utils/diagram/types';
import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import { sanitizeRichText } from '@/lib/sanitize-rich-text';
import { sheet } from './play-sheet-styles';
import { phaseSvgUri } from './utils/play-svg';
import { RichText } from './utils/rich-text';

const CATEGORY_LABEL: Record<string, string> = {
  OFFENSIVE: 'Offense',
  DEFENSIVE: 'Defense',
  SPECIAL: 'Special teams',
};

export function PlaySheetDocument({
  playName,
  coachName,
  category,
  diagram,
  generatedAt,
}: {
  playName: string;
  coachName: string;
  category: string;
  diagram: PlayDiagram;
  generatedAt: Date;
}) {
  const { w, h } = COURT_VIEWBOX[diagram.court];
  const date = generatedAt.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const count = diagram.phases.length;

  return (
    <Document title={`${playName} — coaching sheet`}>
      <Page size="A4" style={sheet.page}>
        <View>
          <Text style={sheet.wordmark}>NEXTPLAY</Text>
          <Text style={sheet.title}>{playName}</Text>
          <Text style={sheet.meta}>
            <Text style={sheet.metaStrong}>{coachName}</Text>
            {'   ·   '}
            {CATEGORY_LABEL[category] ?? category}
            {'   ·   '}
            {date}
          </Text>
          <View style={sheet.rule}>
            <View style={sheet.tick} />
          </View>
        </View>

        {diagram.phases.map((phase, i) => (
          <View
            key={phase.id}
            style={[sheet.phase, ...(i === 0 ? [sheet.firstPhase] : [])]}
            wrap={false}
          >
            <View style={sheet.court}>
              <Text style={sheet.tag}>PHASE {i + 1}</Text>
              <View style={sheet.frame}>
                {/* @react-pdf Image, not an <img> — no alt attribute */}
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image
                  style={[sheet.diagram, { aspectRatio: w / h }]}
                  src={phaseSvgUri(diagram.court, phase)}
                />
              </View>
            </View>
            <View style={sheet.notes}>
              <RichText html={sanitizeRichText(phase.note)} />
            </View>
          </View>
        ))}

        <View style={sheet.foot} fixed>
          <Text>NextPlay — {playName}</Text>
          <Text>
            {count} {count === 1 ? 'phase' : 'phases'}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
