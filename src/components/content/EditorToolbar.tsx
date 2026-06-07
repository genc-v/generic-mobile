import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/app/entry-editor.styles';

type ToolAction =
  | { kind: 'wrap'; prefix: string; suffix?: string }
  | { kind: 'line'; marker: string }
  | { kind: 'insert'; snippet: string; cursorOffset?: number }
  | { kind: 'sep' };

const TOOLS: { label: string; bold?: boolean; italic?: boolean; underline?: boolean; action: ToolAction }[] = [
  { label: 'B', bold: true, action: { kind: 'wrap', prefix: '**' } },
  { label: 'I', italic: true, action: { kind: 'wrap', prefix: '_' } },
  { label: 'S', action: { kind: 'wrap', prefix: '~~' } },
  { label: '', action: { kind: 'sep' } },
  { label: 'H1', action: { kind: 'line', marker: '# ' } },
  { label: 'H2', action: { kind: 'line', marker: '## ' } },
  { label: '" "', action: { kind: 'line', marker: '> ' } },
  { label: '•', action: { kind: 'line', marker: '- ' } },
  { label: '1.', action: { kind: 'line', marker: '1. ' } },
  { label: '', action: { kind: 'sep' } },
  { label: '< >', action: { kind: 'wrap', prefix: '`' } },
  { label: '🔗', action: { kind: 'insert', snippet: '[text](url)', cursorOffset: 1 } },
];

type Props = {
  onWrap: (prefix: string, suffix?: string) => void;
  onPrefixLine: (marker: string) => void;
  onInsert: (snippet: string, cursorOffset?: number) => void;
};

export function EditorToolbar({ onWrap, onPrefixLine, onInsert }: Props) {
  function runTool(action: ToolAction) {
    if (action.kind === 'wrap') onWrap(action.prefix, action.suffix);
    else if (action.kind === 'line') onPrefixLine(action.marker);
    else if (action.kind === 'insert') onInsert(action.snippet, action.cursorOffset);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.toolbar}
      keyboardShouldPersistTaps="handled"
    >
      {TOOLS.map((tool, i) =>
        tool.action.kind === 'sep' ? (
          <View key={`sep-${i}`} style={styles.toolbarSep} />
        ) : (
          <TouchableOpacity
            key={tool.label + i}
            style={styles.toolBtn}
            onPress={() => runTool(tool.action)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.toolBtnText,
              tool.bold && { fontWeight: '700' },
              tool.italic && { fontStyle: 'italic' },
              tool.underline && { textDecorationLine: 'underline' },
            ]}>
              {tool.label}
            </Text>
          </TouchableOpacity>
        )
      )}
    </ScrollView>
  );
}
