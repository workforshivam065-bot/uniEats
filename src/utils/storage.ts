import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  CART: '@unieats_cart',
  COUPON: '@unieats_coupon',
  FAVORITES_FOOD: '@unieats_fav_food',
  FAVORITES_RESTAURANTS: '@unieats_fav_restaurants',
  ORDERS: '@unieats_orders',
  USER: '@unieats_user',
  ADDRESSES: '@unieats_addresses',
  SELECTED_ADDRESS: '@unieats_selected_address',
};

export const storage = {
  async get<T>(key: string, fallback: T): Promise<T> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
      return fallback;
    } catch (error) {
      console.warn(`[storage.get] Error reading key "${key}":`, error);
      return fallback;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[storage.set] Error setting key "${key}":`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`[storage.remove] Error removing key "${key}":`, error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('[storage.clearAll] Error clearing storage:', error);
    }
  },
};
