import { Platform } from 'react-native';

export const Colors = {
  primary: '#FF5722',         // UniEats Vibrant Ember
  primaryDark: '#E0401B',     // Dark Ember for pressed/focused
  primaryLight: '#FFF0EB',    // Soft coral tint
  primaryMuted: '#FF8A65',

  secondary: '#10B981',       // Fresh Emerald Green (Veg, Success, Discounts)
  secondaryLight: '#ECFDF5',
  secondaryDark: '#047857',

  accent: '#F59E0B',          // Amber for ratings & stars
  accentLight: '#FEF3C7',

  danger: '#EF4444',          // Red for non-veg indicator, delete, errors
  dangerLight: '#FEE2E2',

  warning: '#F97316',
  warningLight: '#FFEDD5',

  info: '#3B82F6',
  infoLight: '#EFF6FF',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  canvas: '#F8FAFC',          // App background
  surface: '#FFFFFF',         // Card background
  surfaceSubtle: '#F1F5F9',   // Input background, chip background
  border: '#E2E8F0',          // Divider, border lines
  borderLight: '#F1F5F9',

  // Typography
  text: '#0F172A',            // Slate 900 - High contrast text
  textSecondary: '#475569',   // Slate 600 - Body & subheadings
  textMuted: '#94A3B8',       // Slate 400 - Captions, placeholders
  textLight: '#CBD5E1',

  // Tab & Navigation
  tabBar: '#FFFFFF',
  tabBarActive: '#FF5722',
  tabBarInactive: '#94A3B8',
  tabBarBorder: '#E2E8F0',

  // Overlay & Badges
  overlay: 'rgba(0, 0, 0, 0.45)',
  vegBadge: '#10B981',
  nonVegBadge: '#EF4444',
  eggBadge: '#F59E0B',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
  none: {},
  sm: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    web: {
      boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
    },
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
    web: {
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
    },
  }),
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
};
