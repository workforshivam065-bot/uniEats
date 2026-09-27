import React, { useState } from 'react';
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
import { FOOD_ITEMS } from '@/data/foods';
import { CustomizationOption } from '@/types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { RatingBadge } from '@/components/common/RatingBadge';
import { QuantitySelector } from '@/components/common/QuantitySelector';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { formatCurrency } from '@/utils/formatters';

export default function FoodDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();
  const { isFavoriteFood, toggleFavoriteFood } = useFavorites();

  const food = FOOD_ITEMS.find((f) => f.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CustomizationOption[]>([]);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  if (!food) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState
          iconName="fast-food-outline"
          title="Dish Not Found"
          description="The food item you are looking for is no longer available on the menu."
          buttonTitle="Back to Menu"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  const isFav = isFavoriteFood(food.id);

  // Group customization options by group
  const groupedOptions = (food.customizationOptions || []).reduce(
    (acc, option) => {
      const grp = option.group;
      if (!acc[grp]) acc[grp] = [];
      acc[grp].push(option);
      return acc;
    },
    {} as Record<string, CustomizationOption[]>
  );

  const handleToggleOption = (option: CustomizationOption) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((o) => o.id === option.id);
      if (exists) {
        return prev.filter((o) => o.id !== option.id);
      } else {
        // If it's a single-choice group like 'Spice Level', remove previous selection in that group
        if (option.group === 'Spice Level') {
          const filtered = prev.filter((o) => o.group !== 'Spice Level');
          return [...filtered, option];
        }
        return [...prev, option];
      }
    });
  };

  // Calculate dynamic price: (base + addons) * quantity
  const addonsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const unitPrice = food.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(food, quantity, selectedOptions);
    setIsAddedFeedback(true);
    setTimeout(() => {
      router.back();
    }, 450);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Food Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: food.image }} style={styles.image} resizeMode="cover" />

          {/* Top Actions */}
          <View style={[styles.topActions, { top: insets.top + 8 }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              style={styles.actionCircle}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleFavoriteFood(food.id)}
              style={styles.actionCircle}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={20}
                color={isFav ? Colors.danger : Colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dish Info Header */}
        <View style={styles.contentCard}>
          <View style={styles.dietaryRow}>
            <DietaryBadge isVeg={food.isVeg} size={18} />
            <Text style={styles.dietaryLabel}>{food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</Text>
            {food.calories && (
              <View style={styles.caloriePill}>
                <Ionicons name="flame-outline" size={13} color={Colors.warning} />
                <Text style={styles.calorieText}>{food.calories} kcal</Text>
              </View>
            )}
          </View>

          <Text style={styles.foodTitle}>{food.name}</Text>
          <Text style={styles.restaurantName}>from {food.restaurantName}</Text>

          <View style={styles.priceRatingRow}>
            <View style={styles.priceBlock}>
              <Text style={styles.currentPrice}>{formatCurrency(food.price)}</Text>
              {food.originalPrice && (
                <Text style={styles.strikethroughPrice}>{formatCurrency(food.originalPrice)}</Text>
              )}
            </View>
            <RatingBadge rating={food.rating} ratingCount={food.ratingCount} size="md" />
          </View>

          <Text style={styles.descriptionText}>{food.description}</Text>

          <View style={styles.prepTimeRow}>
            <Ionicons name="stopwatch-outline" size={16} color={Colors.primary} />
            <Text style={styles.prepTimeText}>Estimated preparation time: {food.prepTime}</Text>
          </View>
        </View>

        {/* Customization Options */}
        {Object.keys(groupedOptions).length > 0 && (
          <View style={styles.customizationsContainer}>
            <Text style={styles.customSectionHeading}>Customize Your Meal</Text>
            <Text style={styles.customSectionSub}>Select add-ons, dips and preference levels</Text>

            {Object.entries(groupedOptions).map(([groupTitle, options]) => (
              <View key={groupTitle} style={styles.groupCard}>
                <Text style={styles.groupHeading}>{groupTitle}</Text>

                {options.map((option) => {
                  const isSelected = selectedOptions.some((o) => o.id === option.id);
                  const isRadio = groupTitle === 'Spice Level';

                  return (
                    <TouchableOpacity
                      key={option.id}
                      activeOpacity={0.7}
                      onPress={() => handleToggleOption(option)}
                      style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                    >
                      <View style={styles.optionLeft}>
                        <Ionicons
                          name={
                            isRadio
                              ? isSelected
                                ? 'radio-button-on'
                                : 'radio-button-off'
                              : isSelected
                              ? 'checkbox'
                              : 'square-outline'
                          }
                          size={20}
                          color={isSelected ? Colors.primary : Colors.textMuted}
                        />
                        <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>
                          {option.name}
                        </Text>
                      </View>

                      <Text style={styles.optionPrice}>
                        {option.price === 0 ? 'Free' : `+${formatCurrency(option.price)}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Quantity</Text>
          <QuantitySelector
            quantity={quantity}
            onIncrement={() => setQuantity((q) => q + 1)}
            onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
            size="md"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAddToCart}
          style={[styles.addCartBtn, isAddedFeedback && styles.addCartBtnFeedback]}
        >
          {isAddedFeedback ? (
            <View style={styles.feedbackRow}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
              <Text style={styles.addCartText}>ADDED TO CART!</Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <Text style={styles.addCartText}>Add to Cart</Text>
              <Text style={styles.btnPriceDivider}>|</Text>
              <Text style={styles.btnPriceText}>{formatCurrency(totalPrice)}</Text>
            </View>
          )}
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
    paddingBottom: 130,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  contentCard: {
    marginTop: -24,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: 18,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dietaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dietaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  caloriePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: 'auto',
  },
  calorieText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    marginLeft: 3,
  },
  foodTitle: {
    ...Typography.h1,
    fontSize: 22,
    marginTop: 4,
  },
  restaurantName: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  priceRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  strikethroughPrice: {
    fontSize: 14,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  descriptionText: {
    ...Typography.bodyMedium,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  prepTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    marginTop: 14,
  },
  prepTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginLeft: 8,
  },
  customizationsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  customSectionHeading: {
    ...Typography.h2,
    fontSize: 18,
  },
  customSectionSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  groupCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  groupHeading: {
    ...Typography.h3,
    fontSize: 15,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionRowSelected: {
    backgroundColor: 'rgba(255, 87, 34, 0.04)',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionName: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 10,
  },
  optionNameSelected: {
    fontWeight: '700',
    color: Colors.text,
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    ...Shadows.lg,
  },
  quantitySection: {
    alignItems: 'flex-start',
  },
  quantityLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  addCartBtn: {
    flex: 1,
    marginLeft: 18,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  addCartBtnFeedback: {
    backgroundColor: Colors.secondary,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCartText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  btnPriceDivider: {
    color: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 10,
    fontSize: 16,
  },
  btnPriceText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
});
