import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Order, OrderStatus } from '@/types';
import { Colors, BorderRadius, Shadows, Typography } from '@/constants/theme';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const router = useRouter();
  const { addToCart } = useCart();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return { label: 'Order Placed', bg: Colors.warningLight, text: Colors.warning };
      case 'accepted':
        return { label: 'Accepted', bg: Colors.infoLight, text: Colors.info };
      case 'preparing':
        return { label: 'Food Preparing', bg: Colors.accentLight, text: '#B45309' };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', bg: Colors.primaryLight, text: Colors.primary };
      case 'delivered':
        return { label: 'Delivered', bg: Colors.secondaryLight, text: Colors.secondaryDark };
      case 'cancelled':
        return { label: 'Cancelled', bg: Colors.dangerLight, text: Colors.danger };
      default:
        return { label: status, bg: Colors.surfaceSubtle, text: Colors.textSecondary };
    }
  };

  const badge = getStatusBadge(order.status);
  const isActive = order.status !== 'delivered' && order.status !== 'cancelled';

  const handleReorder = (e: any) => {
    e.stopPropagation();
    order.items.forEach((item) => {
      addToCart(item.food, item.quantity, item.selectedOptions);
    });
    router.push('/cart' as any);
  };

  const itemsSummary = order.items
    .map((item) => `${item.food.name} x${item.quantity}`)
    .join(', ');

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      {/* Top row: Restaurant Image, Name, Order Number & Status */}
      <View style={styles.topRow}>
        <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
        <View style={styles.restaurantInfo}>
          <View style={styles.titleStatusRow}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {order.restaurantName}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
            </View>
          </View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.dateText}>{formatDateTime(order.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Items Summary */}
      <Text style={styles.itemsSummary} numberOfLines={2}>
        {itemsSummary}
      </Text>

      {/* Bottom Bar: Amount & Action Buttons */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
        </View>

        <View style={styles.actionsRow}>
          {isActive ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPress}
              style={styles.trackBtn}
            >
              <Ionicons name="navigate-outline" size={14} color={Colors.white} />
              <Text style={styles.trackBtnText}>Track Order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleReorder}
              style={styles.reorderBtn}
            >
              <Ionicons name="repeat" size={14} color={Colors.primary} />
              <Text style={styles.reorderBtnText}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  titleStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    ...Typography.h3,
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderNumber: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  itemsSummary: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  trackBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 87, 34, 0.3)',
  },
  reorderBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
});
