import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { DS } from '../../constants/ds';

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  note?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  autoComplete?: 'email' | 'password' | 'username' | 'new-password' | 'off';
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  note,
  autoCapitalize = 'none',
  keyboardType = 'default',
  autoComplete,
}: Props) {
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, note && styles.containerError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={DS.text3}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCorrect={false}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden(h => !h)} style={styles.eyeBtn}>
            <EyeIcon hidden={hidden} />
          </TouchableOpacity>
        )}
      </View>
      {note && <Text style={styles.note}>{note}</Text>}
    </View>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <View style={styles.eyeIcon}>
      <Text style={styles.eyeText}>●●●</Text>
    </View>
  ) : (
    <View style={styles.eyeIcon}>
      <Text style={styles.eyeText}>○○○</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.text1,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  container: {
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: DS.border,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  containerError: {
    borderColor: DS.red,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: DS.text1,
    letterSpacing: -0.1,
    padding: 0,
  },
  eyeBtn: {
    paddingLeft: 8,
  },
  eyeIcon: {
    opacity: 0.5,
  },
  eyeText: {
    fontSize: 8,
    color: DS.text3,
    letterSpacing: 2,
  },
  note: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.red,
    marginTop: 6,
  },
});
