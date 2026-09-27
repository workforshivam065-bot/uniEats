import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CouponInput } from '@/components/cart/CouponInput';
import { PriceBreakdown } from '@/components/cart/PriceBreakdown';
import { EmptyState } from '@/components/common/EmptyState';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/formatters';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    taxes,
    discount,
    total,
    appliedCoupon,
    itemCount,
  } = useCart();

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Your Cart" showBack onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="cart-outline"
            title="Your Cart is Empty"
            description="Looks like you haven't added any campus meals or snacks yet. Explore our student canteens!"
            buttonTitle="Explore Food"
            onButtonPress={() => router.push('/(tabs)/search' as any)}
          />
        </View>
      </View>
    );
  }

  const restaurantName = items[0]?.food?.restaurantName || 'Campus Eatery';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Your Cart"
        subtitle={`${itemCount} items from ${restaurantName}`}
        showBack
        onBack={() => router.back()}
        rightElement={
          <TouchableOpacity
            onPress={clearCart}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Restaurant Header Banner */}
        <View style={styles.outletCard}>
          <Ionicons name="restaurant-outline" size={18} color={Colors.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.outletTitle}>{restaurantName}</Text>
            <Text style={styles.outletSubtitle}>Campus Express Order</Text>
          </View>
        </View>

        {/* Cart Items List */}
        <View style={styles.itemsCard}>
          <Text style={styles.sectionHeading}>Items Ordered</Text>
          {items.map((item) => (
            <CartItemRow
              key={item.cartItemId}
              item={item}
              onIncrement={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              onDecrement={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              onRemove={() => removeFromCart(item.cartItemId)}
            />
          ))}
        </View>

        {/* Coupons & Offers */}
        <CouponInput />

        {/* Bill Summary */}
        <PriceBreakdown
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          taxes={taxes}
          discount={discount}
          total={total}
          appliedCouponCode={appliedCoupon?.code}
        />

        {/* Campus Delivery Guarantee Note */}
        <View style={styles.guaranteeCard}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.secondary} />
          <Text style={styles.guaranteeText}>
            Delivered hot to your campus room or study hall in approx. 15-25 minutes.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Proceed to Checkout Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <View>
          <Text style={styles.totalPriceLabel}>Total Amount</Text>
          <Text style={styles.totalPriceValue}>{formatCurrency(total)}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push('/checkout' as any)}
          style={styles.checkoutBtn}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  outletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  outletTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  outletSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  itemsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  sectionHeading: {
    ...Typography.h3,
    fontSize: 15,
    marginBottom: 8,
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    borderRadius: BorderRadius.lg,
    padding: 12,
    marginTop: 16,
  },
  guaranteeText: {
    fontSize: 12,
    color: Colors.secondaryDark,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    ...Shadows.lg,
  },
  totalPriceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  checkoutBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
    marginRight: 6,
  },
});
