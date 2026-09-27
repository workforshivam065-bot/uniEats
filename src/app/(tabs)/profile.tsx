import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrdersContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';

interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  badge?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  onPress,
  isDestructive = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.menuItemRow}
    >
      <View
        style={[
          styles.menuIconBox,
          isDestructive && { backgroundColor: Colors.dangerLight },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isDestructive ? Colors.danger : Colors.primary}
        />
      </View>

      <View style={styles.menuItemContent}>
        <Text
          style={[
            styles.menuItemTitle,
            isDestructive && { color: Colors.danger },
          ]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>

      {badge && (
        <View style={styles.menuBadge}>
          <Text style={styles.menuBadgeText}>{badge}</Text>
        </View>
      )}

      <Ionicons
        name="chevron-forward"
        size={18}
        color={Colors.textMuted}
      />
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const { favoriteFoodIds, favoriteRestaurantIds } = useFavorites();
  const { addresses } = useCart();

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of UniEats?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login' as any);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <Image
            source={{
              uri:
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{user?.name || 'Student User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'student@campus.edu'}</Text>
            <View style={styles.studentIdBadge}>
              <Ionicons name="school-outline" size={13} color={Colors.primary} />
              <Text style={styles.studentIdText}>{user?.studentId || 'UE-2024-CS089'}</Text>
            </View>
          </View>
        </View>

        {/* Campus Stats Banner */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {favoriteFoodIds.length + favoriteRestaurantIds.length}
            </Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.secondary }]}>450</Text>
            <Text style={styles.statLabel}>UniPoints</Text>
          </View>
        </View>

        {/* Menu Section 1: Orders & Favorites */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Activity</Text>
          <View style={styles.menuGroupCard}>
            <ProfileMenuItem
              icon="receipt-outline"
              title="My Orders"
              subtitle="View all past receipts & live tracking"
              badge={orders.length > 0 ? `${orders.length}` : undefined}
              onPress={() => router.push('/(tabs)/orders' as any)}
            />
            <ProfileMenuItem
              icon="heart-outline"
              title="Favorite Foods & Outlets"
              subtitle="Quick reordering from your liked menu"
              onPress={() => router.push('/(tabs)/favorites' as any)}
            />
          </View>
        </View>

        {/* Menu Section 2: Account Settings */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Preferences & Payment</Text>
          <View style={styles.menuGroupCard}>
            <ProfileMenuItem
              icon="location-outline"
              title="Saved Addresses"
              subtitle={`${addresses.length} campus locations registered`}
              onPress={() => setAddressModalOpen(true)}
            />
            <ProfileMenuItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Simulated UPI & Campus Card"
              onPress={() => setPaymentsModalOpen(true)}
            />
            <ProfileMenuItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Order alerts & student promos"
              onPress={() => router.push('/notifications' as any)}
            />
          </View>
        </View>

        {/* Menu Section 3: Support & About */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Support & Info</Text>
          <View style={styles.menuGroupCard}>
            <ProfileMenuItem
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="Contact campus canteens & runner desk"
              onPress={() =>
                Alert.alert(
                  'Student Help Desk',
                  'Emergency food delivery support: support@unieats.campus\nPhone: +91 98765 43210 (Ext. 404)'
                )
              }
            />
            <ProfileMenuItem
              icon="information-circle-outline"
              title="About UniEats"
              subtitle="Version 1.0.0 (Portfolio Edition)"
              onPress={() => setAboutModalOpen(true)}
            />
            <ProfileMenuItem
              icon="log-out-outline"
              title="Log Out"
              onPress={handleLogout}
              isDestructive
            />
          </View>
        </View>
      </ScrollView>

      {/* Saved Addresses Modal */}
      <Modal
        visible={addressModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAddressModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setAddressModalOpen(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.sheetTitle}>Saved Campus Addresses</Text>
            <Text style={styles.sheetSubtitle}>Your registered dorms and campus halls</Text>

            {addresses.map((addr) => (
              <View key={addr.id} style={styles.addressRow}>
                <Ionicons name="location" size={20} color={Colors.primary} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.addrTitle}>{addr.title}</Text>
                  <Text style={styles.addrSub}>
                    {addr.room} • {addr.campusZone}
                  </Text>
                </View>
                {addr.isDefault && (
                  <View style={styles.defaultChip}>
                    <Text style={styles.defaultChipText}>DEFAULT</Text>
                  </View>
                )}
              </View>
            ))}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAddressModalOpen(false)}
              style={styles.closeModalBtn}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal
        visible={paymentsModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentsModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setPaymentsModalOpen(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.sheetTitle}>Payment Methods</Text>
            <Text style={styles.sheetSubtitle}>Configured simulated mock payment gateways</Text>

            <View style={styles.paymentCardMock}>
              <Ionicons name="flash" size={22} color={Colors.warning} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.paymentMockTitle}>Campus Student UPI</Text>
                <Text style={styles.paymentMockSub}>Google Pay, PhonePe, Paytm (Simulated Active)</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color={Colors.secondary} />
            </View>

            <View style={styles.paymentCardMock}>
              <Ionicons name="card" size={22} color={Colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.paymentMockTitle}>Institute Student Meal Card</Text>
                <Text style={styles.paymentMockSub}>**** **** 4092 (Balance: ₹1,250)</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color={Colors.secondary} />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setPaymentsModalOpen(false)}
              style={styles.closeModalBtn}
            >
              <Text style={styles.closeModalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* About UniEats Modal */}
      <Modal
        visible={aboutModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setAboutModalOpen(false)}
          style={styles.modalBackdrop}
        >
          <View style={[styles.modalSheet, { paddingBottom: 28 }]}>
            <View style={styles.modalHandle} />
            <View style={styles.aboutLogoRow}>
              <View style={styles.aboutLogoCircle}>
                <Ionicons name="flame" size={24} color={Colors.white} />
              </View>
              <Text style={styles.aboutBrand}>UniEats</Text>
            </View>
            <Text style={styles.aboutVersion}>Version 1.0.0 • React Native & Expo Router</Text>

            <Text style={styles.aboutBody}>
              UniEats is built for university students to order delicious meals from campus eateries,
              customize dishes with real-time dynamic pricing, apply student coupons, and track runner deliveries to their dorm rooms.
            </Text>

            <Text style={styles.aboutCredits}>Designed & Built by Shivam Singh</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAboutModalOpen(false)}
              style={styles.closeModalBtn}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
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
    paddingBottom: 60,
  },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileDetails: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    ...Typography.h2,
    fontSize: 18,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  studentIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  studentIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginLeft: 4,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuGroupCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 14,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  menuBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: 6,
  },
  menuBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
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
  sheetTitle: {
    ...Typography.h2,
    fontSize: 18,
  },
  sheetSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  addrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  addrSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  defaultChip: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.secondaryDark,
  },
  paymentCardMock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginBottom: 10,
  },
  paymentMockTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  paymentMockSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeModalBtn: {
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginTop: 16,
  },
  closeModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  aboutLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  aboutLogoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aboutBrand: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  aboutVersion: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  aboutBody: {
    ...Typography.bodyMedium,
    textAlign: 'center',
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  aboutCredits: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
});
