import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatters';

interface PriceBreakdownProps {
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  appliedCouponCode?: string;
  style?: ViewStyle;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  subtotal,
  deliveryFee,
  taxes,
  discount,
  total,
  appliedCouponCode,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.cardTitle}>Bill Summary</Text>

      {/* Subtotal */}
      <View style={styles.row}>
        <Text style={styles.label}>Item Total</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>

      {/* Delivery Fee */}
      <View style={styles.row}>
        <View style={styles.labelWithIcon}>
          <Text style={styles.label}>Campus Delivery Fee</Text>
          {deliveryFee === 0 && subtotal > 0 && (
            <View style={styles.freeChip}>
              <Text style={styles.freeText}>FREE</Text>
            </View>
          )}
        </View>
        <Text style={[styles.value, deliveryFee === 0 && styles.freeValue]}>
          {deliveryFee === 0 ? '₹0' : formatCurrency(deliveryFee)}
        </Text>
      </View>

      {/* Taxes and Platform Service */}
      <View style={styles.row}>
        <Text style={styles.label}>Taxes & Charges (5% GST)</Text>
        <Text style={styles.value}>{formatCurrency(taxes)}</Text>
      </View>

      {/* Discount */}
      {discount > 0 && (
        <View style={styles.row}>
          <View style={styles.labelWithIcon}>
            <Ionicons name="pricetag" size={13} color={Colors.secondary} style={{ marginRight: 4 }} />
            <Text style={[styles.label, { color: Colors.secondaryDark, fontWeight: '600' }]}>
              Discount ({appliedCouponCode})
            </Text>
          </View>
          <Text style={[styles.value, { color: Colors.secondaryDark, fontWeight: '700' }]}>
            -{formatCurrency(discount)}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Grand Total */}
      <View style={styles.totalRow}>
        <View>
          <Text style={styles.totalLabel}>To Pay</Text>
          <Text style={styles.taxInclusiveText}>Inclusive of all campus taxes</Text>
        </View>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardTitle: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  freeChip: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  freeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  freeValue: {
    color: Colors.secondaryDark,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  taxInclusiveText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
});
