import type { PlayDiagram } from '@/features/playbook/utils/diagram/types';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { sanitizeRichText } from '@/lib/sanitize-rich-text';
import { CourtPdf } from './court-pdf';
import { sheet } from './play-sheet-styles';
import { autoNote } from './utils/auto-note';
import { RichText } from './utils/rich-text';

const CATEGORY_LABEL: Record<string, string> = {
  OFFENSIVE: 'Offense',
  DEFENSIVE: 'Defense',
  SPECIAL: 'Special teams',
};

// a phase the coach wrote notes for gets a full-width row (court + prose);
// phases with only auto-described movement pack two to a row
const COURT_WIDE = 185;
const COURT_HALF = 225;

function Caption({ phase }: { phase: PlayDiagram['phases'][number] }) {
  const auto = autoNote(phase);
  return auto ? (
    <Text style={sheet.caption}>
      <Text style={sheet.captionLead}>Movement </Text>
      {auto}
    </Text>
  ) : (
    <Text style={sheet.caption}>
      <Text style={sheet.captionLead}>Reset </Text>players hold their spots
    </Text>
  );
}

function FullRow({
  diagram,
  index,
  first,
}: {
  diagram: PlayDiagram;
  index: number;
  first: boolean;
}) {
  const phase = diagram.phases[index];
  return (
    <View style={[sheet.row, ...(first ? [sheet.firstRow] : [])]} wrap={false}>
      <View>
        <Text style={sheet.tag}>PHASE {index + 1}</Text>
        <View style={sheet.frame}>
          <CourtPdf court={diagram.court} phase={phase} width={COURT_WIDE} />
        </View>
      </View>
      <View style={sheet.notes}>
        <RichText html={sanitizeRichText(phase.note)} />
      </View>
    </View>
  );
}

function PairRow({
  diagram,
  indices,
  first,
}: {
  diagram: PlayDiagram;
  indices: number[];
  first: boolean;
}) {
  return (
    <View style={[sheet.row, ...(first ? [sheet.firstRow] : [])]} wrap={false}>
      {indices.map((index) => (
        <View key={diagram.phases[index].id} style={sheet.cell}>
          <Text style={sheet.tag}>PHASE {index + 1}</Text>
          <View style={sheet.frame}>
            <CourtPdf
              court={diagram.court}
              phase={diagram.phases[index]}
              width={COURT_HALF}
            />
          </View>
          <Caption phase={diagram.phases[index]} />
        </View>
      ))}
    </View>
  );
}

type Block =
  | { kind: 'full'; index: number }
  | { kind: 'pair'; indices: number[] };

function layout(diagram: PlayDiagram): Block[] {
  const blocks: Block[] = [];
  let pair: number[] = [];
  const flush = () => {
    if (pair.length) blocks.push({ kind: 'pair', indices: pair });
    pair = [];
  };

  diagram.phases.forEach((phase, index) => {
    if (sanitizeRichText(phase.note)) {
      flush();
      blocks.push({ kind: 'full', index });
    } else {
      pair.push(index);
      if (pair.length === 2) flush();
    }
  });
  flush();
  return blocks;
}

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

        {layout(diagram).map((block, i) =>
          block.kind === 'full' ? (
            <FullRow
              key={`f${block.index}`}
              diagram={diagram}
              index={block.index}
              first={i === 0}
            />
          ) : (
            <PairRow
              key={`p${block.indices.join('-')}`}
              diagram={diagram}
              indices={block.indices}
              first={i === 0}
            />
          ),
        )}

        <View style={sheet.foot} fixed>
          <Text>NextPlay — {playName}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${count} ${count === 1 ? 'phase' : 'phases'}   ·   ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
