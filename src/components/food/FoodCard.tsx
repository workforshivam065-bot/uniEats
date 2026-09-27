import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem } from '@/types';
import { Colors, BorderRadius, Shadows, Typography } from '@/constants/theme';
import { DietaryBadge } from '../common/DietaryBadge';
import { RatingBadge } from '../common/RatingBadge';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

interface FoodCardProps {
  food: FoodItem;
  onPress: () => void;
  variant?: 'horizontal' | 'row';
  style?: ViewStyle;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onPress,
  variant = 'horizontal',
  style,
}) => {
  const { addToCart, items, updateQuantity } = useCart();
  const { isFavoriteFood, toggleFavoriteFood } = useFavorites();
  const isFav = isFavoriteFood(food.id);

  // Check if this food item exists in cart (base item)
  const cartItemsForFood = items.filter((i) => i.food.id === food.id);
  const totalCartQty = cartItemsForFood.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddDirect = (e: any) => {
    e.stopPropagation();
    if (food.customizationOptions && food.customizationOptions.length > 0) {
      // If customizable, open the food detail modal to select options
      onPress();
    } else {
      addToCart(food, 1, []);
    }
  };

  const handleIncrement = (e: any) => {
    e.stopPropagation();
    if (cartItemsForFood.length > 0) {
      const target = cartItemsForFood[0];
      updateQuantity(target.cartItemId, target.quantity + 1);
    } else {
      handleAddDirect(e);
    }
  };

  const handleDecrement = (e: any) => {
    e.stopPropagation();
    if (cartItemsForFood.length > 0) {
      const target = cartItemsForFood[0];
      updateQuantity(target.cartItemId, target.quantity - 1);
    }
  };

  // Horizontal Card Layout (e.g. for Home Screen Popular carousel)
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={[styles.horizontalCard, style]}
      >
        <View style={styles.horizontalImageWrapper}>
          <Image source={{ uri: food.image }} style={styles.horizontalImage} resizeMode="cover" />
          <TouchableOpacity
            style={styles.favIconBubble}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavoriteFood(food.id);
            }}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={16}
              color={isFav ? Colors.danger : Colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.horizontalContent}>
          <View style={styles.rowAlign}>
            <DietaryBadge isVeg={food.isVeg} size={14} />
            <Text style={styles.restaurantNameSmall} numberOfLines={1}>
              {food.restaurantName}
            </Text>
          </View>

          <Text style={styles.foodName} numberOfLines={1}>
            {food.name}
          </Text>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.price}>{formatCurrency(food.price)}</Text>
              {food.originalPrice && (
                <Text style={styles.originalPrice}>{formatCurrency(food.originalPrice)}</Text>
              )}
            </View>

            {totalCartQty > 0 ? (
              <View style={styles.stepperContainer}>
                <TouchableOpacity onPress={handleDecrement} style={styles.stepperBtn}>
                  <Ionicons name="remove" size={14} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.stepperQty}>{totalCartQty}</Text>
                <TouchableOpacity onPress={handleIncrement} style={styles.stepperBtn}>
                  <Ionicons name="add" size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAddDirect}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>ADD</Text>
                <Ionicons name="add" size={14} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Row Card Layout (e.g. for Restaurant Menu)
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.rowCard, style]}
    >
      <View style={styles.rowLeft}>
        <View style={styles.dietaryRow}>
          <DietaryBadge isVeg={food.isVeg} size={16} />
          {food.isPopular && (
            <View style={styles.bestsellerBadge}>
              <Ionicons name="star" size={10} color={Colors.accent} />
              <Text style={styles.bestsellerText}>Bestseller</Text>
            </View>
          )}
        </View>

        <Text style={styles.rowTitle}>{food.name}</Text>

        <View style={styles.rowPriceRating}>
          <Text style={styles.rowPrice}>{formatCurrency(food.price)}</Text>
          {food.originalPrice && (
            <Text style={styles.rowOrigPrice}>{formatCurrency(food.originalPrice)}</Text>
          )}
          <View style={styles.rowRatingWrap}>
            <RatingBadge rating={food.rating} ratingCount={food.ratingCount} size="sm" />
          </View>
        </View>

        <Text style={styles.rowDesc} numberOfLines={2}>
          {food.description}
        </Text>
      </View>

      <View style={styles.rowRight}>
        <Image source={{ uri: food.image }} style={styles.rowImage} resizeMode="cover" />

        <View style={styles.rowButtonWrapper}>
          {totalCartQty > 0 ? (
            <View style={styles.stepperContainerLarge}>
              <TouchableOpacity onPress={handleDecrement} style={styles.stepperBtnLarge}>
                <Ionicons name="remove" size={14} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.stepperQtyLarge}>{totalCartQty}</Text>
              <TouchableOpacity onPress={handleIncrement} style={styles.stepperBtnLarge}>
                <Ionicons name="add" size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddDirect}
              style={styles.addButtonLarge}
            >
              <Text style={styles.addButtonTextLarge}>ADD</Text>
              <Ionicons name="add" size={15} color={Colors.primary} />
            </TouchableOpacity>
          )}
          {food.customizationOptions && food.customizationOptions.length > 0 && (
            <Text style={styles.customizableText}>Customizable</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Horizontal Styles
  horizontalCard: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  horizontalImageWrapper: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.surfaceSubtle,
    position: 'relative',
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  favIconBubble: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  horizontalContent: {
    padding: 10,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantNameSmall: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 6,
    flex: 1,
  },
  foodName: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  stepperBtn: {
    padding: 2,
  },
  stepperQty: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginHorizontal: 6,
  },

  // Row Styles
  rowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  rowLeft: {
    flex: 1,
    paddingRight: 14,
  },
  dietaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bestsellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  bestsellerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    marginLeft: 3,
  },
  rowTitle: {
    ...Typography.h3,
    fontSize: 15,
    marginBottom: 4,
  },
  rowPriceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  rowOrigPrice: {
    fontSize: 12,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  rowRatingWrap: {
    marginLeft: 10,
  },
  rowDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  rowRight: {
    width: 110,
    alignItems: 'center',
  },
  rowImage: {
    width: 110,
    height: 96,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceSubtle,
  },
  rowButtonWrapper: {
    marginTop: -16,
    alignItems: 'center',
    width: '100%',
  },
  addButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    width: 86,
    height: 32,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  addButtonTextLarge: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 2,
  },
  stepperContainerLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    width: 86,
    height: 32,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingHorizontal: 6,
    ...Shadows.sm,
  },
  stepperBtnLarge: {
    padding: 2,
  },
  stepperQtyLarge: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  customizableText: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 3,
    fontWeight: '500',
  },
});
