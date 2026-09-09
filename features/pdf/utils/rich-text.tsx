import { Fragment, type ReactNode } from 'react';
import { sheet } from '../play-sheet-styles';
import { Text, View } from '@react-pdf/renderer';

// Tiptap step-notes arrive as a small, sanitised HTML subset. @react-pdf has no
// HTML renderer, so turn the blocks into <Text> / bulleted <View> nodes and the
// inline strong / em / u / s / mark into styled runs. Server-side, no DOM.

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

type Run = {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  mark: boolean;
};

const MARK_BG = '#fdf1c4';

export function runsFrom(html: string): Run[] {
  const runs: Run[] = [];
  const depth = { bold: 0, italic: 0, underline: 0, strike: 0, mark: 0 };
  const token = /<(\/?)(strong|b|em|i|u|s|mark)\b[^>]*>|([^<]+)/gi;

  let m: RegExpExecArray | null;
  while ((m = token.exec(html))) {
    if (m[3] != null) {
      const text = decode(m[3]);
      if (text)
        runs.push({
          text,
          bold: depth.bold > 0,
          italic: depth.italic > 0,
          underline: depth.underline > 0,
          strike: depth.strike > 0,
          mark: depth.mark > 0,
        });
      continue;
    }
    const tag = m[2].toLowerCase();
    const key =
      tag === 'strong' || tag === 'b'
        ? 'bold'
        : tag === 'em' || tag === 'i'
          ? 'italic'
          : tag === 'u'
            ? 'underline'
            : tag === 's'
              ? 'strike'
              : 'mark';
    depth[key] += m[1] === '/' ? -1 : 1;
  }
  return runs;
}

// the 14 standard PDF fonts are separate families — pick the variant by name
// rather than leaning on fontWeight / fontStyle, which react-pdf can't resolve
// for the built-ins
const FACE = (bold: boolean, italic: boolean) =>
  bold && italic
    ? 'Helvetica-BoldOblique'
    : bold
      ? 'Helvetica-Bold'
      : italic
        ? 'Helvetica-Oblique'
        : 'Helvetica';

function renderRuns(runs: Run[]): ReactNode {
  return runs.map((run, i) => (
    <Text
      key={i}
      style={{
        fontFamily: FACE(run.bold, run.italic),
        textDecoration: run.strike
          ? 'line-through'
          : run.underline
            ? 'underline'
            : 'none',
        backgroundColor: run.mark ? MARK_BG : undefined,
      }}
    >
      {run.text}
    </Text>
  ));
}

export function RichText({ html }: { html: string }): ReactNode {
  if (!html.trim()) {
    return <Text style={sheet.empty}>No notes for this phase.</Text>;
  }

  const blocks: ReactNode[] = [];
  const block =
    /<(h[1-6]|p|blockquote|pre)\b[^>]*>([\s\S]*?)<\/\1>|<(ul|ol)\b[^>]*>([\s\S]*?)<\/\3>/gi;

  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = block.exec(html))) {
    if (m[3]) {
      const ordered = m[3].toLowerCase() === 'ol';
      const items = [...m[4].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)];
      items.forEach((li, k) => {
        blocks.push(
          <View key={`l${i}-${k}`} style={sheet.listRow}>
            <Text style={sheet.bullet}>{ordered ? `${k + 1}.` : '•'}</Text>
            <Text style={sheet.listText}>{renderRuns(runsFrom(li[1]))}</Text>
          </View>,
        );
      });
    } else {
      const heading = m[1].toLowerCase().startsWith('h');
      blocks.push(
        <Text key={`b${i}`} style={heading ? sheet.heading : sheet.paragraph}>
          {renderRuns(runsFrom(m[2]))}
        </Text>,
      );
    }
    i++;
  }

  if (blocks.length === 0) {
    const plain = decode(html.replace(/<[^>]+>/g, ' '))
      .replace(/\s+/g, ' ')
      .trim();
    return <Text style={sheet.paragraph}>{plain}</Text>;
  }

  return <Fragment>{blocks}</Fragment>;
}
