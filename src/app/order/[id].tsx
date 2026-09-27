import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { OrderTimeline } from '@/components/order/OrderTimeline';
import { EmptyState } from '@/components/common/EmptyState';
import { useOrders } from '@/context/OrdersContext';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getOrderById } = useOrders();

  const order = getOrderById(id);

  if (!order) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Order Tracking" showBack onBack={() => router.back()} />
        <EmptyState
          iconName="receipt-outline"
          title="Order Not Found"
          description="We couldn't locate this order record. Please check your Orders history tab."
          buttonTitle="View All Orders"
          onButtonPress={() => router.push('/(tabs)/orders' as any)}
        />
      </View>
    );
  }

  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title={order.orderNumber}
        subtitle={isDelivered ? 'Delivered' : isCancelled ? 'Cancelled' : 'Live Tracking'}
        showBack
        onBack={() => router.back()}
        rightElement={
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Campus Support',
                'Need help with this order? Call our Student Help Desk at extension 404.'
              )
            }
          >
            <Ionicons name="help-circle-outline" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Header Hero */}
        <View style={styles.statusHeroCard}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroStatusTitle}>
                {isDelivered
                  ? 'Order Delivered! 🎉'
                  : isCancelled
                  ? 'Order Cancelled'
                  : 'Preparing & On the Way'}
              </Text>
              <Text style={styles.heroEstimatedTime}>
                {isDelivered
                  ? 'Hope you enjoyed your meal!'
                  : `Estimated arrival: ${order.estimatedDeliveryTime}`}
              </Text>
            </View>
            <View style={styles.deliveryIconCircle}>
              <Ionicons
                name={isDelivered ? 'checkmark-circle' : 'bicycle'}
                size={28}
                color={isDelivered ? Colors.secondary : Colors.primary}
              />
            </View>
          </View>
        </View>

        {/* Live Stepped Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardHeading}>Delivery Progress</Text>
          <OrderTimeline steps={order.timeline} />
        </View>

        {/* Campus Delivery Runner & Outlet Contact */}
        <View style={styles.runnerCard}>
          <View style={styles.runnerRow}>
            <View style={styles.runnerAvatarCircle}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.runnerName}>Rahul Verma (Campus Runner)</Text>
              <Text style={styles.runnerSub}>Student Delivery Partner</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Alert.alert('Contacting Runner', 'Connecting to runner at +91 98765 00123...')}
              style={styles.callRunnerBtn}
            >
              <Ionicons name="call" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Destination Details */}
        <View style={styles.destinationCard}>
          <View style={styles.destHeader}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <Text style={styles.destHeading}>Delivery Destination</Text>
          </View>
          <Text style={styles.destTitle}>{order.deliveryAddress.title}</Text>
          <Text style={styles.destRoom}>
            {order.deliveryAddress.room} • {order.deliveryAddress.campusZone}
          </Text>
        </View>

        {/* Order Items & Restaurant Breakdown */}
        <View style={styles.summaryCard}>
          <View style={styles.restaurantRow}>
            <Image source={{ uri: order.restaurantImage }} style={styles.outletThumb} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.outletName}>{order.restaurantName}</Text>
              <Text style={styles.orderDate}>{formatDateTime(order.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {order.items.map((item) => (
            <View key={item.cartItemId} style={styles.itemRow}>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.food.name}</Text>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <Text style={styles.itemOptions}>
                    {item.selectedOptions.map((o) => o.name).join(', ')}
                  </Text>
                )}
              </View>
              <Text style={styles.itemPrice}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.billLine}>
            <Text style={styles.billLabel}>Payment Mode</Text>
            <Text style={styles.billVal}>{order.paymentMethod} ({order.paymentStatus})</Text>
          </View>

          <View style={styles.billLine}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billVal}>{formatCurrency(order.subtotal)}</Text>
          </View>

          {order.discount > 0 && (
            <View style={styles.billLine}>
              <Text style={[styles.billLabel, { color: Colors.secondaryDark }]}>
                Discount ({order.appliedCoupon})
              </Text>
              <Text style={[styles.billVal, { color: Colors.secondaryDark }]}>
                -{formatCurrency(order.discount)}
              </Text>
            </View>
          )}

          <View style={[styles.billLine, styles.totalLine]}>
            <Text style={styles.grandTotalLabel}>Total Paid</Text>
            <Text style={styles.grandTotalVal}>{formatCurrency(order.total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/orders' as any)}
          style={styles.allOrdersBtn}
        >
          <Ionicons name="list" size={18} color={Colors.text} />
          <Text style={styles.allOrdersBtnText}>All Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/index' as any)}
          style={styles.homeBtn}
        >
          <Ionicons name="home" size={18} color={Colors.white} />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 110,
  },
  statusHeroCard: {
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.xl,
    padding: 18,
    marginBottom: 14,
    ...Shadows.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroStatusTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  heroEstimatedTime: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  deliveryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  cardHeading: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: 14,
  },
  runnerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  runnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  runnerAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  runnerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  runnerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  callRunnerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  destHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  destHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 6,
  },
  destTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  destRoom: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outletThumb: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  outletName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  orderDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemQuantity: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    width: 26,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  itemOptions: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  billLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  billLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  billVal: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  totalLine: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  grandTotalVal: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    ...Shadows.lg,
  },
  allOrdersBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allOrdersBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 6,
  },
  homeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  homeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    marginLeft: 6,
  },
});
