import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography } from '@/constants/theme';
import { COUPONS } from '@/data/coupons';
import { useCart } from '@/context/CartContext';

export const CouponInput: React.FC = () => {
  const { appliedCoupon, applyCoupon, removeCoupon, subtotal } = useCart();
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApply = (couponCodeToApply?: string) => {
    const targetCode = couponCodeToApply || code;
    if (!targetCode.trim()) return;

    setErrorMsg('');
    const res = applyCoupon(targetCode);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setCode('');
    }
  };

  if (appliedCoupon) {
    return (
      <View style={styles.appliedCard}>
        <View style={styles.appliedLeft}>
          <View style={styles.appliedIconCircle}>
            <Ionicons name="checkmark" size={16} color={Colors.white} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.appliedCode}>{appliedCoupon.code} Applied</Text>
            <Text style={styles.appliedDesc}>{appliedCoupon.title}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={removeCoupon}
          style={styles.removeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.removeBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Offers & Coupons</Text>

      {/* Input row */}
      <View style={styles.inputRow}>
        <Ionicons name="pricetag-outline" size={18} color={Colors.textMuted} style={styles.tagIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter coupon code (e.g. UNI20)"
          placeholderTextColor={Colors.textMuted}
          value={code}
          onChangeText={(val) => {
            setCode(val.toUpperCase());
            if (errorMsg) setErrorMsg('');
          }}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleApply()}
          disabled={!code.trim()}
          style={[styles.applyBtn, !code.trim() && styles.applyBtnDisabled]}
        >
          <Text style={[styles.applyBtnText, !code.trim() && styles.applyBtnTextDisabled]}>
            APPLY
          </Text>
        </TouchableOpacity>
      </View>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      {/* Available Coupon Chips */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsLabel}>Available for you:</Text>
        <View style={styles.chipsRow}>
          {COUPONS.map((coupon) => {
            const isEligible = subtotal >= coupon.minOrder;
            return (
              <TouchableOpacity
                key={coupon.code}
                activeOpacity={0.75}
                onPress={() => handleApply(coupon.code)}
                style={[styles.couponChip, !isEligible && styles.couponChipIneligible]}
              >
                <View style={styles.chipTop}>
                  <Text style={styles.chipCode}>{coupon.code}</Text>
                  <Ionicons name="add-circle" size={14} color={Colors.primary} />
                </View>
                <Text style={styles.chipDesc} numberOfLines={1}>
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
  },
  heading: {
    ...Typography.h3,
    fontSize: 15,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tagIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  applyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  applyBtnDisabled: {
    opacity: 0.4,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  applyBtnTextDisabled: {
    color: Colors.textMuted,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 6,
    marginLeft: 4,
  },
  appliedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryLight,
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 16,
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appliedCode: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  appliedDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  removeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
  suggestionsContainer: {
    marginTop: 12,
  },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  couponChip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 87, 34, 0.25)',
    minWidth: 90,
  },
  couponChipIneligible: {
    opacity: 0.7,
  },
  chipTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipCode: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 4,
  },
  chipDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
