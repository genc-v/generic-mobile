import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { TopBar } from '../../../components/layout/top-bar';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useNotifications } from '../../../viewmodels/useNotifications';
import { formatRelativeTime, notificationIconKind, NotifIconKind } from '../../../utils/notifications';
import { NotificationItem } from '../../../types/notification.types';
import { styles } from '../../../styles/app/profile/notifications.styles';
import { DS } from '../../../constants/ds';

function NotifIcon({ kind, color }: { kind: NotifIconKind; color: string }) {
  const p = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' };
  switch (kind) {
    case 'asset':
      return <Svg {...p}><Path d="M3 12.5h10M8 2.5v8M5 7.5L8 10.5l3-3" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'user':
      return <Svg {...p}><Circle cx={8} cy={5.5} r={2.5} stroke={color} strokeWidth={1.4} /><Path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke={color} strokeWidth={1.4} strokeLinecap="round" /></Svg>;
    case 'key':
      return <Svg {...p}><Circle cx={6} cy={7} r={3} stroke={color} strokeWidth={1.4} /><Path d="M9 7h4.5M11.5 7v2" stroke={color} strokeWidth={1.4} strokeLinecap="round" /></Svg>;
    case 'edit':
      return <Svg {...p}><Path d="M10 2.5L13.5 6 5.5 14H2V10.5L10 2.5Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" /></Svg>;
    case 'delete':
      return <Svg {...p}><Path d="M2.5 4.5h11M6 4.5V3h4v1.5M12.5 4.5l-.7 9H4.2l-.7-9" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'bell':
    default:
      return <Svg {...p}><Path d="M8 1.5A4.5 4.5 0 0 0 3.5 6v3.5L2 11h12l-1.5-1.5V6A4.5 4.5 0 0 0 8 1.5Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" /><Path d="M6.5 11.5a1.5 1.5 0 0 0 3 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" /></Svg>;
  }
}

function NotificationRow({ item, onMarkRead }: { item: NotificationItem; onMarkRead: (id: string) => void }) {
  const unread = !item.isRead;
  const time = formatRelativeTime(item.createdAt);
  const iconKind = notificationIconKind(item.type);
  const iconColor = unread ? DS.text1 : DS.text3;

  return (
    <TouchableOpacity
      style={[styles.card, unread && styles.cardUnread]}
      onPress={() => unread && onMarkRead(item.id)}
      activeOpacity={unread ? 0.7 : 1}
    >
      {unread && <View style={styles.cardAccent} />}
      <View style={[styles.iconBox, unread ? styles.iconBoxUnread : styles.iconBoxRead]}>
        <NotifIcon kind={iconKind} color={iconColor} />
      </View>
      <View style={styles.body}>
        <View style={styles.metaRow}>
          {unread && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
          )}
          {time ? (
            <View style={styles.timePill}>
              <Text style={styles.timePillText}>{time}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.message, unread ? styles.messageUnread : styles.messageRead]}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const vm = useNotifications();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Notifications" />

      {!vm.loading && !vm.error && (
        <View style={styles.toolbar}>
          {vm.hasItems && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Inbox</Text>
              <Text style={styles.summaryCount}>{vm.inboxSummary}</Text>
            </View>
          )}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionPill, styles.actionPillPrimary]}
              onPress={vm.markAllRead}
              hitSlop={8}
              disabled={!vm.canMarkAllRead}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionPillText, styles.actionPillTextPrimary]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {vm.loading ? (
        <View style={styles.skeletonWrap}>
          {[0, 1, 2, 3].map(i => (
            <Skeleton key={i} width="100%" height={88} radius={10} />
          ))}
        </View>
      ) : vm.error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{vm.error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={vm.reload} activeOpacity={0.7}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !vm.hasItems ? (
        <View style={styles.center}>
          <View style={styles.emptyIconWrap}>
            <Svg width={24} height={24} viewBox="0 0 16 16" fill="none">
              <Path d="M8 1.5A4.5 4.5 0 0 0 3.5 6v3.5L2 11h12l-1.5-1.5V6A4.5 4.5 0 0 0 8 1.5Z" stroke={DS.text3} strokeWidth={1.4} strokeLinejoin="round" />
              <Path d="M6.5 11.5a1.5 1.5 0 0 0 3 0" stroke={DS.text3} strokeWidth={1.4} strokeLinecap="round" />
            </Svg>
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyHint}>{vm.emptyHint}</Text>
          <View style={[styles.statusPill, vm.hubConnected && styles.statusPillLive]}>
            <Text style={[styles.statusPillText, vm.hubConnected && styles.statusPillTextLive]}>
              {vm.statusLabel}
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={vm.notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <NotificationRow item={item} onMarkRead={vm.markRead} />}
          showsVerticalScrollIndicator={false}
          onEndReached={vm.loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            vm.loadingMore
              ? <ActivityIndicator style={{ marginVertical: 16 }} color={DS.text3} />
              : null
          }
        />
      )}
    </SafeAreaView>
  );
}
