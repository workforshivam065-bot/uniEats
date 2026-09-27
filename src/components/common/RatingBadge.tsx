import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface RatingBadgeProps {
  rating: number;
  ratingCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  ratingCount,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconSize = isSm ? 10 : isLg ? 14 : 12;
  const fontSize = isSm ? 11 : isLg ? 14 : 12;

  return (
    <View style={[styles.container, isSm && styles.sm, isLg && styles.lg]}>
      <Ionicons name="star" size={iconSize} color={Colors.white} style={styles.icon} />
      <Text style={[styles.ratingText, { fontSize }]}>{rating.toFixed(1)}</Text>
      {ratingCount !== undefined && (
        <Text style={[styles.countText, isSm && { fontSize: 10 }]}>
          ({ratingCount > 999 ? `${(ratingCount / 1000).toFixed(1)}k` : ratingCount})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sm: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  lg: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  icon: {
    marginRight: 3,
  },
  ratingText: {
    color: Colors.white,
    fontWeight: '700',
  },
  countText: {
    color: 'rgba(255, 255, 255, 0.85)',
    marginLeft: 3,
    fontSize: 11,
    fontWeight: '500',
  },
});
