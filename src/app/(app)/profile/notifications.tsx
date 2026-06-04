import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TopBar } from '../../../components/layout/top-bar';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useNotifications } from '../../../viewmodels/useNotifications';
import { formatRelativeTime, notificationIcon } from '../../../utils/notifications';
import { NotificationItem } from '../../../types/notification.types';
import { styles } from '../../../styles/app/profile/notifications.styles';

function NotificationRow({ item }: { item: NotificationItem }) {
  const unread = !item.isRead;
  const time = formatRelativeTime(item.createdAt);

  return (
    <View style={[styles.card, unread && styles.cardUnread]}>
      {unread && <View style={styles.cardAccent} />}
      <View style={[styles.iconBox, unread ? styles.iconBoxUnread : styles.iconBoxRead]}>
        <Text style={styles.iconText}>{notificationIcon(item.type)}</Text>
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
    </View>
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
            <TouchableOpacity
              style={[styles.actionPill, styles.actionPillMuted]}
              onPress={vm.clearAll}
              hitSlop={8}
              disabled={!vm.canClearAll}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionPillText, styles.actionPillTextMuted]}>
                Clear all
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
            <Text style={styles.emptyIcon}>🔔</Text>
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
          renderItem={({ item }) => <NotificationRow item={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
