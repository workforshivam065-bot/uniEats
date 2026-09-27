import { Coupon } from '@/types';

export const COUPONS: Coupon[] = [
  {
    code: 'UNI20',
    title: 'Campus Special 20% OFF',
    description: 'Get 20% discount up to ₹100 on orders above ₹149 across any campus eatery.',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 100,
    minOrder: 149,
  },
  {
    code: 'STUDENT10',
    title: 'Student Saver 10% OFF',
    description: 'Enjoy 10% instant discount up to ₹50 on any order value above ₹99.',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 50,
    minOrder: 99,
  },
  {
    code: 'WELCOME',
    title: 'UniEats Welcome Flat ₹50',
    description: 'Flat ₹50 OFF on your first food order above ₹199.',
    discountType: 'flat',
    discountValue: 50,
    minOrder: 199,
  },
];
