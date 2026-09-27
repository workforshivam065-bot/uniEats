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
import { Restaurant } from '@/types';
import { Colors, BorderRadius, Shadows, Typography } from '@/constants/theme';
import { RatingBadge } from '../common/RatingBadge';
import { useFavorites } from '@/context/FavoritesContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  variant?: 'featured' | 'compact';
  style?: ViewStyle;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
  variant = 'featured',
  style,
}) => {
  const { isFavoriteRestaurant, toggleFavoriteRestaurant } = useFavorites();
  const isFav = isFavoriteRestaurant(restaurant.id);

  const isFeatured = variant === 'featured';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        isFeatured ? styles.featuredCard : styles.compactCard,
        style,
      ]}
    >
      {/* Cover Image Container */}
      <View style={[styles.imageContainer, isFeatured ? styles.featuredImageHeight : styles.compactImageHeight]}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Gradient / Overlay Details */}
        <View style={styles.topBadgesRow}>
          {restaurant.offerBadge ? (
            <View style={styles.offerBadge}>
              <Ionicons name="pricetag" size={11} color={Colors.white} style={{ marginRight: 4 }} />
              <Text style={styles.offerText}>{restaurant.offerBadge}</Text>
            </View>
          ) : <View />}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavoriteRestaurant(restaurant.id);
            }}
            style={styles.favoriteButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={18}
              color={isFav ? Colors.danger : Colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Status indicator (Closed overlay or badge) */}
        {!restaurant.isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>CLOSED NOW</Text>
            <Text style={styles.closedSubtext}>Opens {restaurant.openingHours.split('-')[0]}</Text>
          </View>
        )}
      </View>

      {/* Restaurant Info */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <RatingBadge rating={restaurant.rating} ratingCount={restaurant.ratingCount} size="sm" />
        </View>

        <Text style={styles.tagline} numberOfLines={1}>
          {restaurant.tagline}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
          </View>
          <Text style={styles.metaDot}>•</Text>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>{restaurant.distance.split('(')[0].trim()}</Text>
          </View>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.priceIndicator}>{restaurant.priceIndicator}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  featuredCard: {
    marginBottom: 16,
    width: '100%',
  },
  compactCard: {
    width: 260,
    marginRight: 14,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: Colors.surfaceSubtle,
  },
  featuredImageHeight: {
    height: 165,
  },
  compactImageHeight: {
    height: 135,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  offerText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  closedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  closedSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  infoContainer: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...Typography.h3,
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  tagline: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 3,
    fontWeight: '500',
  },
  metaDot: {
    marginHorizontal: 6,
    color: Colors.textMuted,
    fontSize: 10,
  },
  priceIndicator: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
});
