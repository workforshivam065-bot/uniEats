import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius } from '@/constants/theme';
import { OrderCard } from '@/components/order/OrderCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useOrders } from '@/context/OrdersContext';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { activeOrders, pastOrders } = useOrders();

  const [activeTab, setActiveTab] = useState<'active' | 'previous'>('active');

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Orders</Text>
        <Text style={styles.screenSubtitle}>Track live campus deliveries & past meals</Text>
      </View>

      {/* Segmented Tab Buttons */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('active')}
          style={[styles.segmentBtn, activeTab === 'active' && styles.segmentBtnActive]}
        >
          <Text style={[styles.segmentText, activeTab === 'active' && styles.segmentTextActive]}>
            Active Orders ({activeOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('previous')}
          style={[styles.segmentBtn, activeTab === 'previous' && styles.segmentBtnActive]}
        >
          <Text
            style={[styles.segmentText, activeTab === 'previous' && styles.segmentTextActive]}
          >
            Past Orders ({pastOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List / Empty State */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayedOrders.length === 0 ? (
          <EmptyState
            iconName="receipt-outline"
            title={activeTab === 'active' ? 'No Active Orders' : 'No Past Orders'}
            description={
              activeTab === 'active'
                ? 'You do not have any food orders currently being prepared or out for delivery.'
                : 'You have not placed any orders yet. Try out the Campus Café or Burger Lab!'
            }
            buttonTitle="Order Now"
            onButtonPress={() => router.push('/(tabs)/search' as any)}
          />
        ) : (
          displayedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => router.push(`/order/${order.id}` as any)}
            />
          ))
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: Colors.white,
  },
  screenTitle: {
    ...Typography.h1,
    fontSize: 24,
  },
  screenSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 10,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
