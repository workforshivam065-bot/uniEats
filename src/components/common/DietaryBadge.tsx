import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface DietaryBadgeProps {
  isVeg: boolean;
  size?: number;
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ isVeg, size = 16 }) => {
  const color = isVeg ? Colors.vegBadge : Colors.nonVegBadge;
  const innerDotSize = Math.round(size * 0.45);

  return (
    <View
      style={[
        styles.outerBox,
        {
          width: size,
          height: size,
          borderColor: color,
        },
      ]}
    >
      <View
        style={[
          styles.innerDot,
          {
            width: innerDotSize,
            height: innerDotSize,
            borderRadius: innerDotSize / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerBox: {
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  innerDot: {},
});
