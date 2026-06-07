import { View, Text, TouchableOpacity } from 'react-native';
import { NotificationItem } from '../../types/notification.types';
import { formatRelativeTime, notificationIconKind } from '../../utils/notifications';
import { NotifIcon } from './NotifIcon';
import { styles } from '../../styles/app/profile/notifications.styles';
import { DS } from '../../constants/ds';

type Props = {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
};

export function NotificationRow({ item, onMarkRead }: Props) {
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
