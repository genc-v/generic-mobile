import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { TopBar } from '../../../components/layout/top-bar';
import { Skeleton } from '../../../components/ui/Skeleton';
import { NotificationRow } from '../../../components/notifications/NotificationRow';
import { useNotifications } from '../../../viewmodels/useNotifications';
import { styles } from '../../../styles/app/profile/notifications.styles';
<<<<<<< HEAD

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
=======
import { DS } from '../../../constants/ds';
>>>>>>> 7d11747ab31ea83a11d599a14b4ffdf79b2adc6c

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
<<<<<<< HEAD
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
=======
              <Text style={[styles.actionPillText, styles.actionPillTextPrimary]}>Mark all read</Text>
>>>>>>> 7d11747ab31ea83a11d599a14b4ffdf79b2adc6c
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
<<<<<<< HEAD
            <Text style={styles.emptyIcon}>🔔</Text>
=======
            <Svg width={24} height={24} viewBox="0 0 16 16" fill="none">
              <Path d="M8 1.5A4.5 4.5 0 0 0 3.5 6v3.5L2 11h12l-1.5-1.5V6A4.5 4.5 0 0 0 8 1.5Z" stroke={DS.text3} strokeWidth={1.4} strokeLinejoin="round" />
              <Path d="M6.5 11.5a1.5 1.5 0 0 0 3 0" stroke={DS.text3} strokeWidth={1.4} strokeLinecap="round" />
            </Svg>
>>>>>>> 7d11747ab31ea83a11d599a14b4ffdf79b2adc6c
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
<<<<<<< HEAD
          renderItem={({ item }) => <NotificationRow item={item} />}
          showsVerticalScrollIndicator={false}
=======
          renderItem={({ item }) => <NotificationRow item={item} onMarkRead={vm.markRead} />}
          showsVerticalScrollIndicator={false}
          onEndReached={vm.loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            vm.loadingMore
              ? <ActivityIndicator style={{ marginVertical: 16 }} color={DS.text3} />
              : null
          }
>>>>>>> 7d11747ab31ea83a11d599a14b4ffdf79b2adc6c
        />
      )}
    </SafeAreaView>
  );
}
