import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { EmptyState } from '@/components/common/EmptyState';
import { useNotifications } from '@/context/NotificationContext';
import { formatTime } from '@/utils/formatters';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const handleNotificationPress = (notif: (typeof notifications)[0]) => {
    markAsRead(notif.id);
    if (notif.orderId) {
      router.push(`/order/ord-10190` as any);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'order':
        return { name: 'fast-food' as const, bg: Colors.primaryLight, color: Colors.primary };
      case 'promo':
        return { name: 'pricetag' as const, bg: Colors.secondaryLight, color: Colors.secondaryDark };
      default:
        return { name: 'information-circle' as const, bg: Colors.infoLight, color: Colors.info };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}
        showBack
        onBack={() => router.back()}
        rightElement={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllAsRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length === 0 ? (
          <EmptyState
            iconName="notifications-outline"
            title="No notifications yet"
            description="We'll notify you here when your campus orders are accepted, prepared, or delivered."
          />
        ) : (
          notifications.map((notif) => {
            const iconConfig = getNotifIcon(notif.type);

            return (
              <TouchableOpacity
                key={notif.id}
                activeOpacity={0.78}
                onPress={() => handleNotificationPress(notif)}
                style={[styles.notifCard, !notif.isRead && styles.notifCardUnread]}
              >
                <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
                  <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
                </View>

                <View style={styles.contentWrap}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[styles.title, !notif.isRead && styles.titleUnread]}
                      numberOfLines={1}
                    >
                      {notif.title}
                    </Text>
                    <Text style={styles.timeText}>{formatTime(notif.timestamp)}</Text>
                  </View>

                  <Text style={styles.messageText}>{notif.message}</Text>

                  {notif.orderId && (
                    <View style={styles.orderLinkRow}>
                      <Text style={styles.orderLinkText}>Track Order #{notif.orderId}</Text>
                      <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
                    </View>
                  )}
                </View>

                {!notif.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  notifCardUnread: {
    backgroundColor: '#FFFDFD',
    borderColor: 'rgba(255, 87, 34, 0.25)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrap: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 6,
  },
  titleUnread: {
    fontWeight: '800',
    color: Colors.text,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  messageText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  orderLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  orderLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
    marginTop: 6,
  },
});
