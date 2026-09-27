import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OrderTimelineStep } from '@/types';
import { Colors, BorderRadius, Typography } from '@/constants/theme';

interface OrderTimelineProps {
  steps: OrderTimelineStep[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ steps }) => {
  const getStepIcon = (status: string): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'placed':
        return 'receipt-outline';
      case 'accepted':
        return 'checkmark-done-circle-outline';
      case 'preparing':
        return 'flame-outline';
      case 'out_for_delivery':
        return 'bicycle-outline';
      case 'delivered':
        return 'home-outline';
      default:
        return 'radio-button-on-outline';
    }
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const iconName = getStepIcon(step.status);

        return (
          <View key={step.status} style={styles.stepRow}>
            {/* Left Marker & Connecting Line */}
            <View style={styles.markerColumn}>
              <View
                style={[
                  styles.dot,
                  step.isCompleted && styles.dotCompleted,
                  step.isCurrent && styles.dotCurrent,
                ]}
              >
                {step.isCompleted ? (
                  <Ionicons name="checkmark" size={12} color={Colors.white} />
                ) : (
                  <Ionicons
                    name={iconName}
                    size={12}
                    color={step.isCurrent ? Colors.white : Colors.textMuted}
                  />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.line,
                    step.isCompleted && styles.lineCompleted,
                  ]}
                />
              )}
            </View>

            {/* Step Details */}
            <View style={styles.contentColumn}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.title,
                    step.isCompleted && styles.titleCompleted,
                    step.isCurrent && styles.titleCurrent,
                  ]}
                >
                  {step.title}
                </Text>
                {step.isCurrent && (
                  <View style={styles.liveBadge}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.liveText}>ACTIVE</Text>
                  </View>
                )}
              </View>
              <Text style={styles.description}>{step.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  markerColumn: {
    alignItems: 'center',
    width: 28,
    marginRight: 12,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dotCompleted: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  dotCurrent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  lineCompleted: {
    backgroundColor: Colors.secondary,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  titleCompleted: {
    color: Colors.text,
    fontWeight: '700',
  },
  titleCurrent: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 4,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
});
