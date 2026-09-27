import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { RESTAURANTS } from '@/data/restaurants';
import { FOOD_ITEMS } from '@/data/foods';
import { RatingBadge } from '@/components/common/RatingBadge';
import { FoodCard } from '@/components/food/FoodCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/formatters';

const MENU_CATEGORIES: ('Recommended' | 'Starters' | 'Main Course' | 'Snacks' | 'Beverages' | 'Desserts')[] = [
  'Recommended',
  'Starters',
  'Main Course',
  'Snacks',
  'Beverages',
  'Desserts',
];

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavoriteRestaurant, toggleFavoriteRestaurant } = useFavorites();
  const { items, total, itemCount } = useCart();

  const [activeMenuCat, setActiveMenuCat] = useState<string>('Recommended');
  const [vegOnly, setVegOnly] = useState(false);

  const restaurant = RESTAURANTS.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState
          iconName="alert-circle-outline"
          title="Restaurant Not Found"
          description="The campus outlet you are looking for might have moved or closed."
          buttonTitle="Back to Home"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  const isFav = isFavoriteRestaurant(restaurant.id);

  // Filter foods belonging to this restaurant
  const allRestaurantFoods = FOOD_ITEMS.filter((f) => f.restaurantId === restaurant.id);

  // Filter by menu category and optional veg-only toggle
  const displayedFoods = allRestaurantFoods.filter((f) => {
    const matchesCategory = activeMenuCat === 'Recommended' ? true : f.menuCategory === activeMenuCat;
    const matchesVeg = !vegOnly || f.isVeg;
    return matchesCategory && matchesVeg;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover Hero Banner */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />

          {/* Top Bar Actions */}
          <View style={[styles.topActionsBar, { top: insets.top + 8 }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              style={styles.actionIconCircle}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleFavoriteRestaurant(restaurant.id)}
              style={styles.actionIconCircle}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={20}
                color={isFav ? Colors.danger : Colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Card Overlay */}
        <View style={styles.infoCard}>
          <View style={styles.titleRatingRow}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <RatingBadge rating={restaurant.rating} ratingCount={restaurant.ratingCount} size="md" />
          </View>

          <Text style={styles.tagline}>{restaurant.tagline}</Text>
          <Text style={styles.description}>{restaurant.description}</Text>

          <View style={styles.metadataPills}>
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={14} color={Colors.primary} />
              <Text style={styles.metaPillText}>{restaurant.deliveryTime}</Text>
            </View>

            <View style={styles.metaPill}>
              <Ionicons name="location-outline" size={14} color={Colors.info} />
              <Text style={styles.metaPillText}>{restaurant.distance}</Text>
            </View>

            <View
              style={[
                styles.metaPill,
                { backgroundColor: restaurant.isOpen ? Colors.secondaryLight : Colors.dangerLight },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: restaurant.isOpen ? Colors.secondary : Colors.danger },
                ]}
              />
              <Text
                style={[
                  styles.metaPillText,
                  { color: restaurant.isOpen ? Colors.secondaryDark : Colors.danger, fontWeight: '700' },
                ]}
              >
                {restaurant.isOpen ? 'OPEN NOW' : 'CLOSED'}
              </Text>
            </View>
          </View>

          {restaurant.offerBadge && (
            <View style={styles.offerCard}>
              <Ionicons name="pricetag" size={14} color={Colors.primary} />
              <Text style={styles.offerCardText}>{restaurant.offerBadge} on all orders!</Text>
            </View>
          )}
        </View>

        {/* Menu Section Controls */}
        <View style={styles.menuHeaderSection}>
          <View style={styles.menuTitleRow}>
            <Text style={styles.menuHeading}>Menu Items</Text>

            {/* Veg Only Toggle */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setVegOnly((prev) => !prev)}
              style={[styles.vegFilterButton, vegOnly && styles.vegFilterButtonActive]}
            >
              <View style={[styles.vegFilterDot, vegOnly && styles.vegFilterDotActive]} />
              <Text style={[styles.vegFilterText, vegOnly && styles.vegFilterTextActive]}>
                Veg Only
              </Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Menu Categories Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.menuCategoriesScroll}
          >
            {MENU_CATEGORIES.map((cat) => {
              const isActive = activeMenuCat === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.75}
                  onPress={() => setActiveMenuCat(cat)}
                  style={[styles.menuCatTab, isActive && styles.menuCatTabActive]}
                >
                  <Text style={[styles.menuCatText, isActive && styles.menuCatTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Foods List */}
        <View style={styles.menuList}>
          {displayedFoods.length === 0 ? (
            <EmptyState
              iconName="restaurant-outline"
              title="No Dishes in this Section"
              description="Try selecting another category or turn off the Veg-Only filter."
            />
          ) : (
            displayedFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                variant="row"
                onPress={() => router.push(`/food/${food.id}` as any)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Cart Bar */}
      {itemCount > 0 && (
        <View style={[styles.floatingCartBar, { bottom: insets.bottom + 12 }]}>
          <View style={styles.cartInfo}>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{itemCount}</Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.cartTotalText}>{formatCurrency(total)}</Text>
              <Text style={styles.cartSubText}>Tap to review & checkout</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  topActionsBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  actionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  infoCard: {
    marginTop: -28,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: 16,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  titleRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    ...Typography.h1,
    fontSize: 22,
    flex: 1,
    marginRight: 10,
  },
  tagline: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    lineHeight: 18,
    marginTop: 6,
  },
  metadataPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.md,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    marginTop: 12,
  },
  offerCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 6,
  },
  menuHeaderSection: {
    marginTop: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: 12,
  },
  menuTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  menuHeading: {
    ...Typography.h2,
    fontSize: 18,
  },
  vegFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
  },
  vegFilterButtonActive: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondaryLight,
  },
  vegFilterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginRight: 6,
  },
  vegFilterDotActive: {
    backgroundColor: Colors.secondary,
  },
  vegFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  vegFilterTextActive: {
    color: Colors.secondaryDark,
  },
  menuCategoriesScroll: {
    paddingHorizontal: 16,
  },
  menuCatTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSubtle,
    marginRight: 8,
  },
  menuCatTabActive: {
    backgroundColor: Colors.primary,
  },
  menuCatText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  menuCatTextActive: {
    color: Colors.white,
  },
  menuList: {
    backgroundColor: Colors.white,
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
});
