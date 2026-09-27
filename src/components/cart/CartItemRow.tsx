import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '@/types';
import { Colors, BorderRadius, Typography } from '@/constants/theme';
import { DietaryBadge } from '../common/DietaryBadge';
import { QuantitySelector } from '../common/QuantitySelector';
import { formatCurrency } from '@/utils/formatters';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const { food, selectedOptions, quantity, totalPrice } = item;

  return (
    <View style={styles.container}>
      <Image source={{ uri: food.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <View style={styles.dietaryWrap}>
              <DietaryBadge isVeg={food.isVeg} size={13} />
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {food.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.removeBtn}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
          </TouchableOpacity>
        </View>

        {selectedOptions && selectedOptions.length > 0 && (
          <Text style={styles.optionsText} numberOfLines={2}>
            {selectedOptions.map((o) => o.name).join(', ')}
          </Text>
        )}

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatCurrency(totalPrice)}</Text>
          <QuantitySelector
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            size="sm"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  dietaryWrap: {
    marginRight: 6,
  },
  name: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  removeBtn: {
    padding: 2,
  },
  optionsText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
});
