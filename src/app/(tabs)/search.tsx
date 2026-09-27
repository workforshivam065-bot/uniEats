import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { SearchBar } from '@/components/common/SearchBar';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { FoodCard } from '@/components/food/FoodCard';
import { EmptyState } from '@/components/common/EmptyState';
import { RESTAURANTS } from '@/data/restaurants';
import { FOOD_ITEMS } from '@/data/foods';
import { CATEGORIES } from '@/data/categories';

const POPULAR_SEARCH_TAGS = [
  'Burger',
  'Kulhad Chai',
  'Panini',
  'Biryani',
  'Maggi',
  'Dimsums',
  'Pizza',
  'Samosa',
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Cheese Maggi',
    'Campus Café',
    'Cold Coffee',
  ]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter States
  const [selectedDietary, setSelectedDietary] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [under20MinOnly, setUnder20MinOnly] = useState(false);
  const [sortByPrice, setSortByPrice] = useState<'asc' | 'desc' | null>(null);

  const hasActiveFilters =
    selectedDietary !== 'all' ||
    selectedRating !== null ||
    selectedCategory !== null ||
    under20MinOnly ||
    sortByPrice !== null;

  const resetFilters = () => {
    setSelectedDietary('all');
    setSelectedRating(null);
    setSelectedCategory(null);
    setUnder20MinOnly(false);
    setSortByPrice(null);
  };

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
  };

  // Perform search filtering
  const { filteredFoods, filteredRestaurants } = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    // 1. Filter foods
    let foods = FOOD_ITEMS.filter((item) => {
      const matchesQuery =
        !trimmed ||
        item.name.toLowerCase().includes(trimmed) ||
        item.description.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed) ||
        item.restaurantName.toLowerCase().includes(trimmed);

      const matchesDietary =
        selectedDietary === 'all' ||
        (selectedDietary === 'veg' && item.isVeg) ||
        (selectedDietary === 'non-veg' && !item.isVeg);

      const matchesRating = selectedRating === null || item.rating >= selectedRating;

      const matchesCategory =
        selectedCategory === null || item.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesQuery && matchesDietary && matchesRating && matchesCategory;
    });

    if (sortByPrice === 'asc') {
      foods = foods.sort((a, b) => a.price - b.price);
    } else if (sortByPrice === 'desc') {
      foods = foods.sort((a, b) => b.price - a.price);
    }

    // 2. Filter restaurants
    const rests = RESTAURANTS.filter((r) => {
      const matchesQuery =
        !trimmed ||
        r.name.toLowerCase().includes(trimmed) ||
        r.tagline.toLowerCase().includes(trimmed) ||
        r.category.toLowerCase().includes(trimmed);

      const matchesRating = selectedRating === null || r.rating >= selectedRating;

      const matchesCategory =
        selectedCategory === null || r.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesTime = !under20MinOnly || r.deliveryTime.includes('10-15') || r.deliveryTime.includes('15-20');

      return matchesQuery && matchesRating && matchesCategory && matchesTime;
    });

    return { filteredFoods: foods, filteredRestaurants: rests };
  }, [query, selectedDietary, selectedRating, selectedCategory, under20MinOnly, sortByPrice]);

  const showInitialState = !query.trim() && !hasActiveFilters;
  const noResults = !showInitialState && filteredFoods.length === 0 && filteredRestaurants.length === 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Bar Header */}
      <View style={styles.searchHeader}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search for food, canteen or meal..."
          onFilterPress={() => setFilterModalVisible(true)}
          hasActiveFilter={hasActiveFilters}
          autoFocus={false}
        />
      </View>

      {/* Filter Chips Horizontal Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipsRow}
      >
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={[styles.filterPill, hasActiveFilters && styles.filterPillActive]}
        >
          <Ionicons
            name="funnel-outline"
            size={13}
            color={hasActiveFilters ? Colors.white : Colors.text}
          />
          <Text style={[styles.filterPillText, hasActiveFilters && styles.filterPillTextActive]}>
            Filters {hasActiveFilters ? '•' : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedDietary((prev) => (prev === 'veg' ? 'all' : 'veg'))}
          style={[styles.filterPill, selectedDietary === 'veg' && styles.filterPillActive]}
        >
          <Text style={[styles.filterPillText, selectedDietary === 'veg' && styles.filterPillTextActive]}>
            🌱 Pure Veg
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedDietary((prev) => (prev === 'non-veg' ? 'all' : 'non-veg'))}
          style={[styles.filterPill, selectedDietary === 'non-veg' && styles.filterPillActive]}
        >
          <Text style={[styles.filterPillText, selectedDietary === 'non-veg' && styles.filterPillTextActive]}>
            🍗 Non-Veg
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedRating((prev) => (prev === 4.5 ? null : 4.5))}
          style={[styles.filterPill, selectedRating === 4.5 && styles.filterPillActive]}
        >
          <Ionicons
            name="star"
            size={12}
            color={selectedRating === 4.5 ? Colors.white : Colors.accent}
          />
          <Text style={[styles.filterPillText, selectedRating === 4.5 && styles.filterPillTextActive]}>
            4.5+ Rating
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUnder20MinOnly((prev) => !prev)}
          style={[styles.filterPill, under20MinOnly && styles.filterPillActive]}
        >
          <Text style={[styles.filterPillText, under20MinOnly && styles.filterPillTextActive]}>
            ⚡ &lt;20 mins
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Initial Search Discovery State */}
        {showInitialState && (
          <View style={styles.discoverySection}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.groupContainer}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text style={styles.clearRecentText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsWrap}>
                  {recentSearches.map((term) => (
                    <TouchableOpacity
                      key={term}
                      onPress={() => handleSelectSearch(term)}
                      style={styles.recentTag}
                    >
                      <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                      <Text style={styles.recentTagText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Searches */}
            <View style={styles.groupContainer}>
              <Text style={styles.groupTitle}>Popular Searches on Campus 🔥</Text>
              <View style={styles.tagsWrap}>
                {POPULAR_SEARCH_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => handleSelectSearch(tag)}
                    style={styles.popularTag}
                  >
                    <Text style={styles.popularTagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* No Results Found State */}
        {noResults && (
          <EmptyState
            iconName="search-outline"
            title="No Results Found"
            description={`We couldn't find matches for "${query}". Try searching for burgers, momos, rolls, or reset filters.`}
            buttonTitle="Clear Filters"
            onButtonPress={() => {
              setQuery('');
              resetFilters();
            }}
          />
        )}

        {/* Search Results */}
        {!showInitialState && !noResults && (
          <View style={styles.resultsContainer}>
            {/* Matching Restaurants */}
            {filteredRestaurants.length > 0 && (
              <View style={styles.resultGroup}>
                <Text style={styles.resultSectionTitle}>
                  Campus Outlets ({filteredRestaurants.length})
                </Text>
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    variant="featured"
                    onPress={() => router.push(`/restaurant/${restaurant.id}` as any)}
                  />
                ))}
              </View>
            )}

            {/* Matching Food Dishes */}
            {filteredFoods.length > 0 && (
              <View style={styles.resultGroup}>
                <Text style={styles.resultSectionTitle}>
                  Dishes & Meals ({filteredFoods.length})
                </Text>
                <View style={styles.foodsCardList}>
                  {filteredFoods.map((food) => (
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

      {/* Comprehensive Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.filterSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Sort & Filter</Text>
              <TouchableOpacity onPress={resetFilters}>
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Dietary Preferences */}
              <Text style={styles.sheetSectionTitle}>Dietary Preference</Text>
              <View style={styles.modalPillsRow}>
                {[
                  { label: 'All', val: 'all' },
                  { label: 'Vegetarian Only', val: 'veg' },
                  { label: 'Non-Vegetarian', val: 'non-veg' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.val}
                    onPress={() => setSelectedDietary(item.val as any)}
                    style={[
                      styles.modalPill,
                      selectedDietary === item.val && styles.modalPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalPillText,
                        selectedDietary === item.val && styles.modalPillTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Sort */}
              <Text style={styles.sheetSectionTitle}>Sort by Price</Text>
              <View style={styles.modalPillsRow}>
                {[
                  { label: 'Low to High', val: 'asc' },
                  { label: 'High to Low', val: 'desc' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.val}
                    onPress={() =>
                      setSortByPrice((prev) => (prev === item.val ? null : (item.val as any)))
                    }
                    style={[
                      styles.modalPill,
                      sortByPrice === item.val && styles.modalPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalPillText,
                        sortByPrice === item.val && styles.modalPillTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Category Filter */}
              <Text style={styles.sheetSectionTitle}>Food Category</Text>
              <View style={styles.modalPillsRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() =>
                      setSelectedCategory((prev) => (prev === cat.name ? null : cat.name))
                    }
                    style={[
                      styles.modalPill,
                      selectedCategory === cat.name && styles.modalPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalPillText,
                        selectedCategory === cat.name && styles.modalPillTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setFilterModalVisible(false)}
              style={styles.applyFilterButton}
            >
              <Text style={styles.applyFilterBtnText}>Apply Filters</Text>
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
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: Colors.white,
  },
  filterChipsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  filterPillTextActive: {
    color: Colors.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  discoverySection: {
    padding: 16,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupTitle: {
    ...Typography.h3,
    fontSize: 15,
    marginBottom: 10,
  },
  clearRecentText: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '600',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  recentTagText: {
    fontSize: 13,
    color: Colors.text,
    marginLeft: 6,
    fontWeight: '500',
  },
  popularTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 87, 34, 0.2)',
  },
  popularTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  resultsContainer: {
    padding: 16,
  },
  resultGroup: {
    marginBottom: 20,
  },
  resultSectionTitle: {
    ...Typography.h2,
    fontSize: 17,
    marginBottom: 12,
  },
  foodsCardList: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
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
    marginBottom: 14,
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
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
  sheetSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  modalPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modalPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  modalPillTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  applyFilterButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginTop: 18,
    ...Shadows.sm,
  },
  applyFilterBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
