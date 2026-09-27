import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { PriceBreakdown } from '@/components/cart/PriceBreakdown';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { CampusAddress } from '@/types';
import { formatCurrency } from '@/utils/formatters';

type PaymentMethodType = 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    items,
    subtotal,
    deliveryFee,
    taxes,
    discount,
    total,
    appliedCoupon,
    selectedAddress,
    setSelectedAddress,
    addresses,
    addAddress,
    clearCart,
  } = useCart();

  const { placeOrder } = useOrders();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('UPI');
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [newAddressModalVisible, setNewAddressModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Address form inputs
  const [newTitle, setNewTitle] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newZone, setNewZone] = useState('North Campus');
  const [deliveryNote, setDeliveryNote] = useState('');

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Checkout" showBack onBack={() => router.back()} />
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>No items to checkout.</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search' as any)}>
            <Text style={styles.exploreText}>Find Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const primaryRestaurant = items[0].food;

  const handleAddNewAddress = () => {
    if (!newTitle.trim() || !newRoom.trim()) {
      Alert.alert('Required Fields', 'Please enter a location name and room number.');
      return;
    }

    addAddress({
      title: newTitle.trim(),
      room: newRoom.trim(),
      campusZone: newZone,
      isDefault: false,
    });

    setNewTitle('');
    setNewRoom('');
    setNewAddressModalVisible(false);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const order = await placeOrder(
        items,
        primaryRestaurant.restaurantId,
        primaryRestaurant.restaurantName,
        primaryRestaurant.image,
        selectedAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        taxes,
        discount,
        total,
        appliedCoupon?.code
      );

      clearCart();
      // Navigate straight to the real-time order tracking screen
      router.replace(`/order/${order.id}` as any);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Checkout" subtitle="Review & Confirm Order" showBack onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Campus Delivery Location */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.headerLeftWithIcon}>
              <View style={styles.iconCircle}>
                <Ionicons name="location" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.cardSectionTitle}>Campus Delivery Spot</Text>
            </View>
            <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
              <Text style={styles.actionLinkText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectedAddressBox}>
            <Text style={styles.addressTitle}>{selectedAddress.title}</Text>
            <Text style={styles.addressRoom}>
              {selectedAddress.room} • {selectedAddress.campusZone}
            </Text>
            {selectedAddress.landmark && (
              <Text style={styles.addressLandmark}>Landmark: {selectedAddress.landmark}</Text>
            )}
          </View>

          {/* Delivery Note Input */}
          <View style={styles.noteInputRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={Colors.textMuted} />
            <TextInput
              style={styles.noteInput}
              placeholder="Instructions for runner (e.g. Call when outside gate)"
              placeholderTextColor={Colors.textMuted}
              value={deliveryNote}
              onChangeText={setDeliveryNote}
            />
          </View>
        </View>

        {/* Section 2: Payment Method */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.headerLeftWithIcon}>
              <View style={styles.iconCircle}>
                <Ionicons name="card" size={18} color={Colors.secondary} />
              </View>
              <Text style={styles.cardSectionTitle}>Payment Method</Text>
            </View>
            <View style={styles.simulatedBadge}>
              <Text style={styles.simulatedText}>Simulated</Text>
            </View>
          </View>

          {/* UPI */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setPaymentMethod('UPI')}
            style={[styles.paymentOption, paymentMethod === 'UPI' && styles.paymentOptionActive]}
          >
            <Ionicons
              name={paymentMethod === 'UPI' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'UPI' ? Colors.primary : Colors.textMuted}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.paymentTitle}>Instant UPI (Google Pay / PhonePe / Paytm)</Text>
              <Text style={styles.paymentSub}>Fastest student checkout with zero convenience fee</Text>
            </View>
            <Ionicons name="flash" size={16} color={Colors.warning} />
          </TouchableOpacity>

          {/* Credit / Debit Card */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setPaymentMethod('Credit/Debit Card')}
            style={[
              styles.paymentOption,
              paymentMethod === 'Credit/Debit Card' && styles.paymentOptionActive,
            ]}
          >
            <Ionicons
              name={paymentMethod === 'Credit/Debit Card' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'Credit/Debit Card' ? Colors.primary : Colors.textMuted}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.paymentTitle}>Credit or Debit Card</Text>
              <Text style={styles.paymentSub}>Visa, Mastercard, RuPay & Campus Cards</Text>
            </View>
            <Ionicons name="card-outline" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>

          {/* Cash on Delivery */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setPaymentMethod('Cash on Delivery')}
            style={[
              styles.paymentOption,
              paymentMethod === 'Cash on Delivery' && styles.paymentOptionActive,
            ]}
          >
            <Ionicons
              name={paymentMethod === 'Cash on Delivery' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={paymentMethod === 'Cash on Delivery' ? Colors.primary : Colors.textMuted}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.paymentTitle}>Cash on Delivery (COD)</Text>
              <Text style={styles.paymentSub}>Pay runner upon receiving food</Text>
            </View>
            <Ionicons name="cash-outline" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Section 3: Ordered Items Quick Review */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Order Items ({items.length})</Text>
          <View style={styles.itemsSummaryList}>
            {items.map((item) => (
              <View key={item.cartItemId} style={styles.itemRowSummary}>
                <Text style={styles.itemSummaryQty}>{item.quantity}x</Text>
                <Text style={styles.itemSummaryName} numberOfLines={1}>
                  {item.food.name}
                </Text>
                <Text style={styles.itemSummaryPrice}>{formatCurrency(item.totalPrice)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section 4: Price Breakdown */}
        <PriceBreakdown
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          taxes={taxes}
          discount={discount}
          total={total}
          appliedCouponCode={appliedCoupon?.code}
        />
      </ScrollView>

      {/* Sticky Bottom Place Order Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total to Pay</Text>
          <Text style={styles.bottomTotalValue}>{formatCurrency(total)}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
          style={[styles.placeOrderBtn, isSubmitting && { opacity: 0.6 }]}
        >
          <Text style={styles.placeOrderBtnText}>
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </Text>
          <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Select Address Modal */}
      <Modal
        visible={addressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setAddressModalVisible(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Campus Address</Text>
              <TouchableOpacity
                onPress={() => {
                  setAddressModalVisible(false);
                  setNewAddressModalVisible(true);
                }}
              >
                <Text style={styles.addNewLink}>+ Add New</Text>
              </TouchableOpacity>
            </View>

            {addresses.map((addr) => {
              const isSelected = selectedAddress.id === addr.id;
              return (
                <TouchableOpacity
                  key={addr.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedAddress(addr);
                    setAddressModalVisible(false);
                  }}
                  style={[styles.addressOption, isSelected && styles.addressOptionSelected]}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isSelected ? Colors.primary : Colors.textMuted}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.addrOptTitle}>{addr.title}</Text>
                    <Text style={styles.addrOptSub}>
                      {addr.room} • {addr.campusZone}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add New Address Modal */}
      <Modal
        visible={newAddressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNewAddressModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setNewAddressModalVisible(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.sheetTitle}>Add Campus Location</Text>
            <Text style={styles.sheetSub}>E.g. Hostel block, library hall or department lab</Text>

            <View style={styles.formInputGroup}>
              <Text style={styles.inputLabel}>Building / Spot Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Hostel Block C or Science Block"
                placeholderTextColor={Colors.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
              />
            </View>

            <View style={styles.formInputGroup}>
              <Text style={styles.inputLabel}>Room / Floor Details</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Room 204 or Robotics Lab 1"
                placeholderTextColor={Colors.textMuted}
                value={newRoom}
                onChangeText={setNewRoom}
              />
            </View>

            <View style={styles.formInputGroup}>
              <Text style={styles.inputLabel}>Campus Zone</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. North Campus / Engineering Wing"
                placeholderTextColor={Colors.textMuted}
                value={newZone}
                onChangeText={setNewZone}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddNewAddress}
              style={styles.saveAddrButton}
            >
              <Text style={styles.saveAddrText}>Save & Select Location</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  exploreText: {
    ...Typography.h3,
    color: Colors.primary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeftWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardSectionTitle: {
    ...Typography.h3,
    fontSize: 15,
  },
  actionLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  selectedAddressBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  addressRoom: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addressLandmark: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  noteInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  noteInput: {
    flex: 1,
    fontSize: 12,
    color: Colors.text,
    marginLeft: 8,
  },
  simulatedBadge: {
    backgroundColor: Colors.infoLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  simulatedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.info,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  paymentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  paymentSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  itemsSummaryList: {
    marginTop: 4,
  },
  itemRowSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemSummaryQty: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    width: 28,
  },
  itemSummaryName: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
  },
  itemSummaryPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
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
  bottomTotalLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  placeOrderBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
    marginRight: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    ...Typography.h2,
    fontSize: 18,
  },
  sheetSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  addNewLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 10,
    backgroundColor: Colors.surfaceSubtle,
  },
  addressOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  addrOptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  addrOptSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  formInputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    fontSize: 14,
    color: Colors.text,
  },
  saveAddrButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginTop: 10,
  },
  saveAddrText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
