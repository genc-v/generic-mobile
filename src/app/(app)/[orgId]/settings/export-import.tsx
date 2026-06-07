import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import Svg, { Path, Polyline, Line } from 'react-native-svg';
import { TopBar } from '../../../../components/layout/top-bar';
import { useExportImport } from '../../../../viewmodels/useExportImport';
import { ExportFormat } from '../../../../services/export-import.service';
import { styles } from '../../../../styles/app/export-import.styles';
import { DS } from '../../../../constants/ds';

function UploadIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Polyline points="16 16 12 12 8 16" stroke={DS.text2} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="12" x2="12" y2="21" stroke={DS.text2} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" stroke={DS.text2} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function DownloadIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Polyline points="8 17 12 21 16 17" stroke={DS.text1} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="12" x2="12" y2="21" stroke={DS.text1} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" stroke={DS.text1} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={DS.green} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
];

function FormatChips({ value, onChange }: { value: ExportFormat; onChange: (f: ExportFormat) => void }) {
  return (
    <View style={styles.formatRow}>
      {FORMAT_OPTIONS.map(opt => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

interface ExportCardProps {
  title: string;
  sub: string;
  loading: boolean;
  done: boolean;
  error: string | null;
  onPress: () => void;
}

function ExportCard({ title, sub, loading, done, error, onPress }: ExportCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{sub}</Text>
        </View>
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={onPress}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={DS.text2} />
          ) : (
            <>
              <DownloadIcon />
              <Text style={styles.exportBtnText}>Export</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {(done || error) && (
        <View style={styles.statusRow}>
          {done && (
            <>
              <CheckIcon />
              <Text style={styles.statusSuccess}>Shared successfully</Text>
            </>
          )}
          {error && <Text style={styles.statusError}>{error}</Text>}
        </View>
      )}
    </View>
  );
}

export default function ExportImportScreen() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const vm = useExportImport(orgId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Export / Import" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>EXPORT</Text>

        <FormatChips value={vm.format} onChange={vm.setFormat} />

        <ExportCard
          title="Organisations"
          sub="All organisations you belong to"
          loading={vm.orgsState.loading}
          done={vm.orgsState.done}
          error={vm.orgsState.error}
          onPress={() => vm.exportOrgs(vm.format)}
        />

        <ExportCard
          title="Members"
          sub="Members and roles for this organisation"
          loading={vm.membersState.loading}
          done={vm.membersState.done}
          error={vm.membersState.error}
          onPress={() => vm.exportMembers(vm.format)}
        />

        <ExportCard
          title="Entries"
          sub="All content entries"
          loading={vm.entriesState.loading}
          done={vm.entriesState.done}
          error={vm.entriesState.error}
          onPress={() => vm.exportEntries(vm.format)}
        />

        <ExportCard
          title="Categories"
          sub="All categories"
          loading={vm.categoriesState.loading}
          done={vm.categoriesState.done}
          error={vm.categoriesState.error}
          onPress={() => vm.exportCategories(vm.format)}
        />

        <ExportCard
          title="Tags"
          sub="All tags"
          loading={vm.tagsState.loading}
          done={vm.tagsState.done}
          error={vm.tagsState.error}
          onPress={() => vm.exportTags(vm.format)}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>IMPORT</Text>

        <View style={styles.importCard}>
          <Text style={styles.importTitle}>Import Entries</Text>
          <Text style={styles.importHint}>
            Upload a .json, .csv, or .xlsx file. Each row must include a title.
            Categories and tags are created automatically if they don't exist.
          </Text>

          <TouchableOpacity style={styles.pickBtn} onPress={vm.pickFile} activeOpacity={0.7}>
            {vm.importFile ? (
              <>
                <UploadIcon />
                <Text style={styles.fileName} numberOfLines={1}>
                  {vm.importFile.name}
                </Text>
                <TouchableOpacity style={styles.clearBtn} onPress={vm.clearImport} hitSlop={8}>
                  <Text style={styles.clearBtnText}>✕</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <UploadIcon />
                <Text style={styles.pickBtnText}>Pick a file…</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.importActionRow}>
            <TouchableOpacity
              style={[
                styles.importSubmitBtn,
                (!vm.importFile || vm.importing) && styles.importSubmitBtnDisabled,
              ]}
              onPress={vm.doImport}
              activeOpacity={0.8}
              disabled={!vm.importFile || vm.importing}
            >
              {vm.importing ? (
                <ActivityIndicator size="small" color={DS.bg} />
              ) : (
                <Text style={styles.importSubmitText}>Import</Text>
              )}
            </TouchableOpacity>
          </View>

          {vm.importError && (
            <Text style={styles.importErrorText}>{vm.importError}</Text>
          )}

          {vm.importResult && (
            <View style={styles.resultBox}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Imported</Text>
                <Text style={styles.resultValueGreen}>{vm.importResult.imported}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Skipped (duplicates)</Text>
                <Text style={styles.resultValueAmber}>{vm.importResult.skipped}</Text>
              </View>
              {vm.importResult.errors.length > 0 && (
                <View style={styles.errorList}>
                  {vm.importResult.errors.map((err, i) => (
                    <Text key={i} style={styles.errorItem}>• {err}</Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
