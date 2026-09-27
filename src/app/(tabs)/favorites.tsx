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
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { FoodCard } from '@/components/food/FoodCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useFavorites } from '@/context/FavoritesContext';
import { RESTAURANTS } from '@/data/restaurants';
import { FOOD_ITEMS } from '@/data/foods';

type FavoriteTab = 'all' | 'dishes' | 'restaurants';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favoriteFoodIds, favoriteRestaurantIds } = useFavorites();

  const [activeTab, setActiveTab] = useState<FavoriteTab>('all');

  const favoriteRestaurants = RESTAURANTS.filter((r) =>
    favoriteRestaurantIds.includes(r.id)
  );

  const favoriteFoods = FOOD_ITEMS.filter((f) =>
    favoriteFoodIds.includes(f.id)
  );

  const hasAnyFavorites = favoriteRestaurants.length > 0 || favoriteFoods.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Favorites</Text>
        <Text style={styles.screenSubtitle}>Your most-loved campus dishes and canteens</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {[
          { key: 'all', label: `All (${favoriteFoods.length + favoriteRestaurants.length})` },
          { key: 'dishes', label: `Dishes (${favoriteFoods.length})` },
          { key: 'restaurants', label: `Eateries (${favoriteRestaurants.length})` },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab.key as FavoriteTab)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!hasAnyFavorites ? (
          <EmptyState
            iconName="heart-outline"
            title="No favorites yet"
            description="Tap the heart icon on any campus outlet or meal to quickly access it here."
            buttonTitle="Explore Food"
            onButtonPress={() => router.push('/(tabs)/search' as any)}
          />
        ) : (
          <View>
            {/* Outlets Section */}
            {(activeTab === 'all' || activeTab === 'restaurants') && favoriteRestaurants.length > 0 && (
              <View style={styles.sectionWrap}>
                <Text style={styles.sectionHeaderTitle}>Favorite Eateries</Text>
                {favoriteRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    variant="featured"
                    onPress={() => router.push(`/restaurant/${restaurant.id}` as any)}
                  />
                ))}
              </View>
            )}

            {/* Dishes Section */}
            {(activeTab === 'all' || activeTab === 'dishes') && favoriteFoods.length > 0 && (
              <View style={styles.sectionWrap}>
                <Text style={styles.sectionHeaderTitle}>Saved Dishes</Text>
                <View style={styles.foodListCard}>
                  {favoriteFoods.map((food) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      variant="row"
                      onPress={() => router.push(`/food/${food.id}` as any)}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionWrap: {
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    ...Typography.h2,
    fontSize: 17,
    marginBottom: 12,
  },
  foodListCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
});
