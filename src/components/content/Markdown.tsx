import { View, Text, Linking, StyleSheet, TextStyle } from 'react-native';
import { DS } from '../../constants/ds';

type Props = { content: string; style?: TextStyle };

// Inline markers the editor toolbar produces: `code`, **bold**, ~~strike~~,
// _italic_, [text](url). Scans for the earliest token and recurses on the rest.
type Inline =
  | { t: 'text'; v: string }
  | { t: 'code'; v: string }
  | { t: 'bold'; v: string }
  | { t: 'italic'; v: string }
  | { t: 'strike'; v: string }
  | { t: 'link'; v: string; href: string };

const PATTERNS: { t: Inline['t']; re: RegExp }[] = [
  { t: 'code', re: /`([^`]+)`/ },
  { t: 'bold', re: /\*\*([^*]+)\*\*/ },
  { t: 'strike', re: /~~([^~]+)~~/ },
  { t: 'italic', re: /_([^_]+)_/ },
  { t: 'link', re: /\[([^\]]+)\]\(([^)]+)\)/ },
];

function parseInline(text: string): Inline[] {
  if (!text) return [];

  let earliest: { idx: number; t: Inline['t']; m: RegExpMatchArray } | null = null;
  for (const { t, re } of PATTERNS) {
    const m = text.match(re);
    if (m && m.index !== undefined && (earliest === null || m.index < earliest.idx)) {
      earliest = { idx: m.index, t, m };
    }
  }

  if (!earliest) return [{ t: 'text', v: text }];

  const { idx, t, m } = earliest;
  const before = text.slice(0, idx);
  const after = text.slice(idx + m[0].length);

  const node: Inline =
    t === 'link'
      ? { t: 'link', v: m[1], href: m[2] }
      : ({ t, v: m[1] } as Inline);

  return [
    ...(before ? [{ t: 'text', v: before } as Inline] : []),
    node,
    ...parseInline(after),
  ];
}

function InlineText({ text, baseStyle }: { text: string; baseStyle?: TextStyle }) {
  const nodes = parseInline(text);
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.t) {
          case 'bold':
            return <Text key={i} style={styles.bold}>{n.v}</Text>;
          case 'italic':
            return <Text key={i} style={styles.italic}>{n.v}</Text>;
          case 'strike':
            return <Text key={i} style={styles.strike}>{n.v}</Text>;
          case 'code':
            return <Text key={i} style={styles.code}>{n.v}</Text>;
          case 'link':
            return (
              <Text key={i} style={styles.link} onPress={() => Linking.openURL(n.href).catch(() => {})}>
                {n.v}
              </Text>
            );
          default:
            return <Text key={i} style={baseStyle}>{n.v}</Text>;
        }
      })}
    </>
  );
}

export function Markdown({ content, style }: Props) {
  const lines = content.split('\n');

  return (
    <View>
      {lines.map((line, i) => {
        const trimmed = line.trimStart();

        if (trimmed === '') return <View key={i} style={styles.blank} />;

        if (trimmed.startsWith('## ')) {
          return <Text key={i} style={styles.h2}><InlineText text={trimmed.slice(3)} /></Text>;
        }
        if (trimmed.startsWith('# ')) {
          return <Text key={i} style={styles.h1}><InlineText text={trimmed.slice(2)} /></Text>;
        }
        if (trimmed.startsWith('> ')) {
          return (
            <View key={i} style={styles.quote}>
              <Text style={[styles.paragraph, style, styles.quoteText]}>
                <InlineText text={trimmed.slice(2)} baseStyle={styles.quoteText} />
              </Text>
            </View>
          );
        }
        if (trimmed.startsWith('- ')) {
          return (
            <View key={i} style={styles.listRow}>
              <Text style={[styles.paragraph, style]}>{'•'}</Text>
              <Text style={[styles.paragraph, style, styles.listText]}>
                <InlineText text={trimmed.slice(2)} baseStyle={style} />
              </Text>
            </View>
          );
        }
        const numbered = trimmed.match(/^(\d+)\.\s(.*)$/);
        if (numbered) {
          return (
            <View key={i} style={styles.listRow}>
              <Text style={[styles.paragraph, style]}>{numbered[1]}.</Text>
              <Text style={[styles.paragraph, style, styles.listText]}>
                <InlineText text={numbered[2]} baseStyle={style} />
              </Text>
            </View>
          );
        }

        return (
          <Text key={i} style={[styles.paragraph, style]}>
            <InlineText text={trimmed} baseStyle={style} />
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  blank: { height: 12 },
  paragraph: {
    fontSize: 14,
    color: DS.text2,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  h1: {
    fontSize: 22,
    fontWeight: '700',
    color: DS.text1,
    letterSpacing: -0.5,
    lineHeight: 28,
    marginTop: 8,
    marginBottom: 4,
  },
  h2: {
    fontSize: 18,
    fontWeight: '600',
    color: DS.text1,
    letterSpacing: -0.3,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 4,
  },
  bold: { fontWeight: '700', color: DS.text1 },
  italic: { fontStyle: 'italic' },
  strike: { textDecorationLine: 'line-through' },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: DS.text1,
    backgroundColor: DS.surface2,
  },
  link: { color: DS.accent, textDecorationLine: 'underline' },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: DS.border2,
    paddingLeft: 12,
    marginVertical: 2,
  },
  quoteText: { color: DS.text3, fontStyle: 'italic' },
  listRow: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 4,
  },
  listText: { flex: 1 },
});
