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

  return (
    <View style={[styles.row, unread && styles.rowUnread]}>
      <View style={[styles.iconBox, unread ? styles.iconBoxUnread : styles.iconBoxRead]}>
        <Text style={styles.iconText}>{notificationIcon(item.type)}</Text>
      </View>
      <View style={styles.body}>
        <Text style={[styles.message, unread ? styles.messageUnread : styles.messageRead]}>
          {item.message}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
      {unread && <View style={styles.unreadDot} />}
    </View>
  );
}

export default function NotificationsScreen() {
  const vm = useNotifications();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <TopBar title="Notifications" />
      <View style={styles.actionBar}>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={vm.markAllRead} hitSlop={8}>
            <Text style={[styles.headerAction, styles.headerActionAccent]}>Mark all read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={vm.clearAll} hitSlop={8}>
            <Text style={[styles.headerAction, styles.headerActionMuted]}>Clear all</Text>
          </TouchableOpacity>
        </View>
      </View>

      {vm.loading ? (
        <View style={{ padding: 20, gap: 12 }}>
          {[0, 1, 2].map(i => (
            <Skeleton key={i} width="100%" height={64} radius={8} />
          ))}
        </View>
      ) : vm.error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{vm.error}</Text>
          <TouchableOpacity onPress={vm.reload}>
            <Text style={[styles.headerAction, styles.headerActionAccent]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : vm.notifications.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyHint}>
            {vm.hubConnected
              ? 'Log in again or trigger an event — new items appear here in real time.'
              : 'REST list is empty. SignalR is offline; start your local API on port 5053.'}
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={vm.notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <NotificationRow item={item} />}
        />
      )}

    </SafeAreaView>
  );
}
