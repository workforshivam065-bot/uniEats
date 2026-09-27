import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryCard } from '@/components/home/CategoryCard';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { FoodCard } from '@/components/food/FoodCard';
import { CATEGORIES } from '@/data/categories';
import { RESTAURANTS } from '@/data/restaurants';
import { FOOD_ITEMS } from '@/data/foods';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';
import { formatCurrency } from '@/utils/formatters';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, itemCount, selectedAddress, setSelectedAddress, addresses } = useCart();
  const { unreadCount } = useNotifications();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Student';

  // Filter restaurants/foods by selected category if any
  const filteredRestaurants = selectedCategory
    ? RESTAURANTS.filter(
        (r) =>
          r.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          CATEGORIES.find((c) => c.name === selectedCategory)?.name === r.category
      )
    : RESTAURANTS;

  const popularFoods = FOOD_ITEMS.filter((f) => f.isPopular);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Ionicons name="flame" size={16} color={Colors.white} />
              </View>
              <Text style={styles.brandName}>UniEats</Text>
            </View>

            <Text style={styles.greetingText}>
              {getGreeting()}, <Text style={styles.greetingHighlight}>{userName}!</Text>
            </Text>

            {/* Location Selector */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAddressModalVisible(true)}
              style={styles.locationSelector}
            >
              <Ionicons name="location" size={14} color={Colors.primary} />
              <Text style={styles.locationTitle} numberOfLines={1}>
                {selectedAddress?.title || 'Select Campus Location'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Header Right Actions */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/notifications' as any)}
              style={styles.notifButton}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.text} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/profile' as any)}
              style={styles.avatarButton}
            >
              <Image
                source={{
                  uri:
                    user?.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
                }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar Input (Trigger) */}
        <View style={styles.searchSection}>
          <SearchBar
            editable={false}
            onPress={() => router.push('/(tabs)/search' as any)}
            placeholder="Search for food, burgers, chai or canteens..."
          />
        </View>

        {/* Special Offer Promotional Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>CAMPUS EXCLUSIVE</Text>
            </View>
            <Text style={styles.bannerHeading}>20% OFF on your first order</Text>
            <Text style={styles.bannerSubheading}>Use coupon code UNI20 at checkout</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/(tabs)/search' as any)}
              style={styles.bannerCta}
            >
              <Text style={styles.bannerCtaText}>Order Now</Text>
              <Ionicons name="arrow-forward" size={13} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Food Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.seeAllText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.name}
              onPress={() => {
                setSelectedCategory((prev) => (prev === category.name ? null : category.name));
              }}
            />
          ))}
        </ScrollView>

        {/* Popular Campus Food (Horizontal Cards) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Popular Food</Text>
            <Text style={styles.sectionSubtitle}>Student favorites across campus</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search' as any)}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalFoodScroll}
        >
          {popularFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              variant="horizontal"
              onPress={() => router.push(`/food/${food.id}` as any)}
            />
          ))}
        </ScrollView>

        {/* Featured Campus Restaurants */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <View>
            <Text style={styles.sectionTitle}>
              {selectedCategory ? `${selectedCategory} Eateries` : 'Featured Campus Outlets'}
            </Text>
            <Text style={styles.sectionSubtitle}>Delivering hot meals directly to dorms & labs</Text>
          </View>
        </View>

        <View style={styles.restaurantsList}>
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              variant="featured"
              onPress={() => router.push(`/restaurant/${restaurant.id}` as any)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Cart Bar if cart has items */}
      {itemCount > 0 && (
        <View style={[styles.floatingCartBar, { bottom: 12 }]}>
          <View style={styles.cartInfo}>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{itemCount}</Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.cartTotalText}>{formatCurrency(total)}</Text>
              <Text style={styles.cartSubText}>plus campus delivery</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/cart' as any)}
            style={styles.viewCartButton}
          >
            <Text style={styles.viewCartText}>View Cart</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Campus Location Selection Modal */}
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
            <Text style={styles.modalTitle}>Choose Campus Delivery Spot</Text>
            <Text style={styles.modalSubtitle}>Where should your runner drop off the food?</Text>

            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedAddress?.id === item.id;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedAddress(item);
                      setAddressModalVisible(false);
                    }}
                    style={[styles.addressItem, isSelected && styles.addressItemSelected]}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={isSelected ? Colors.primary : Colors.textMuted}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.addressTitle}>{item.title}</Text>
                      <Text style={styles.addressRoom}>{item.room} • {item.campusZone}</Text>
                    </View>
                    {item.isDefault && (
                      <View style={styles.defaultChip}>
                        <Text style={styles.defaultChipText}>DEFAULT</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  greetingText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '500',
  },
  greetingHighlight: {
    fontWeight: '800',
    color: Colors.text,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  locationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 4,
    maxWidth: 160,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: 'relative',
    ...Shadows.sm,
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
  },
  bannerContainer: {
    marginHorizontal: 16,
    backgroundColor: '#1E293B',
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 20,
    ...Shadows.md,
  },
  bannerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  bannerBadge: {
    backgroundColor: 'rgba(255, 87, 34, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bannerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF8A65',
    letterSpacing: 0.5,
  },
  bannerHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 20,
  },
  bannerSubheading: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 12,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  bannerCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
    marginRight: 4,
  },
  bannerImage: {
    width: 125,
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
  },
  sectionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  horizontalFoodScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  restaurantsList: {
    paddingHorizontal: 16,
  },
  floatingCartBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Shadows.lg,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartCountBadge: {
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 13,
  },
  cartTotalText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cartSubText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  viewCartText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
    marginRight: 6,
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
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    ...Typography.h2,
    fontSize: 18,
    textAlign: 'center',
  },
  modalSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 10,
    backgroundColor: Colors.surfaceSubtle,
  },
  addressItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
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
});
