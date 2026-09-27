import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { Category } from '@/types';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, isSelected && styles.containerSelected]}
    >
      <View style={[styles.imageWrapper, isSelected && styles.imageWrapperSelected]}>
        {category.image ? (
          <Image source={{ uri: category.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.fallbackIcon} />
        )}
      </View>
      <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 68,
  },
  containerSelected: {},
  imageWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapperSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackIcon: {
    width: 24,
    height: 24,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  nameSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
