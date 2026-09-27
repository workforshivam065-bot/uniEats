import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/constants/theme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  size = 'md',
  style,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const buttonSize = isSm ? 26 : isLg ? 36 : 30;
  const iconSize = isSm ? 14 : isLg ? 18 : 16;
  const fontSize = isSm ? 13 : isLg ? 16 : 14;

  return (
    <View style={[styles.container, isSm && styles.containerSm, isLg && styles.containerLg, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrement}
        style={[styles.button, { width: buttonSize, height: buttonSize }]}
      >
        <Ionicons name="remove" size={iconSize} color={Colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.quantityText, { fontSize }]}>{quantity}</Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrement}
        style={[styles.button, { width: buttonSize, height: buttonSize }]}
      >
        <Ionicons name="add" size={iconSize} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 87, 34, 0.2)',
  },
  containerSm: {
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  containerLg: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
  },
  quantityText: {
    fontWeight: '700',
    color: Colors.primary,
    marginHorizontal: 10,
    minWidth: 16,
    textAlign: 'center',
  },
});
