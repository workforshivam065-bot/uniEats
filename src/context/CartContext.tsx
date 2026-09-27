import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem, CustomizationOption, Coupon, CampusAddress } from '@/types';
import { COUPONS } from '@/data/coupons';
import { CAMPUS_ADDRESSES } from '@/data/addresses';
import { storage, StorageKeys } from '@/utils/storage';

interface CartContextType {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  selectedAddress: CampusAddress;
  addresses: CampusAddress[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  itemCount: number;
  activeRestaurantId: string | null;
  addToCart: (food: FoodItem, quantity?: number, selectedOptions?: CustomizationOption[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setSelectedAddress: (addr: CampusAddress) => void;
  addAddress: (addr: Omit<CampusAddress, 'id'>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [addresses, setAddresses] = useState<CampusAddress[]>(CAMPUS_ADDRESSES);
  const [selectedAddress, setSelectedAddressState] = useState<CampusAddress>(CAMPUS_ADDRESSES[0]);

  // Hydrate cart and preferences from AsyncStorage on start
  useEffect(() => {
    const hydrate = async () => {
      const savedItems = await storage.get<CartItem[]>(StorageKeys.CART, []);
      const savedCoupon = await storage.get<Coupon | null>(StorageKeys.COUPON, null);
      const savedAddresses = await storage.get<CampusAddress[]>(StorageKeys.ADDRESSES, CAMPUS_ADDRESSES);
      const savedSelected = await storage.get<CampusAddress>(StorageKeys.SELECTED_ADDRESS, CAMPUS_ADDRESSES[0]);

      setItems(savedItems);
      setAppliedCoupon(savedCoupon);
      setAddresses(savedAddresses);
      setSelectedAddressState(savedSelected);
    };
    hydrate();
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    storage.set(StorageKeys.CART, newItems);
  };

  const activeRestaurantId = items.length > 0 ? items[0].food.restaurantId : null;

  const addToCart = (
    food: FoodItem,
    quantity: number = 1,
    selectedOptions: CustomizationOption[] = []
  ) => {
    // Generate unique key based on food id and sorted option ids
    const optionKey = selectedOptions
      .map((o) => o.id)
      .sort()
      .join('-');
    const cartItemId = `${food.id}_${optionKey || 'base'}`;

    const addonsPrice = selectedOptions.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = food.price + addonsPrice;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      let updated: CartItem[];

      if (existingIndex > -1) {
        updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
      } else {
        const newItem: CartItem = {
          cartItemId,
          food,
          quantity,
          selectedOptions,
          unitPrice,
          totalPrice: unitPrice * quantity,
        };
        updated = [...prevItems, newItem];
      }

      storage.set(StorageKeys.CART, updated);
      return updated;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.cartItemId !== cartItemId);
      storage.set(StorageKeys.CART, filtered);
      return filtered;
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity,
          };
        }
        return item;
      });
      storage.set(StorageKeys.CART, updated);
      return updated;
    });
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
    storage.remove(StorageKeys.COUPON);
  };

  const setSelectedAddress = (addr: CampusAddress) => {
    setSelectedAddressState(addr);
    storage.set(StorageKeys.SELECTED_ADDRESS, addr);
  };

  const addAddress = (addr: Omit<CampusAddress, 'id'>) => {
    const newAddr: CampusAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    const updated = [newAddr, ...addresses];
    setAddresses(updated);
    setSelectedAddress(newAddr);
    storage.set(StorageKeys.ADDRESSES, updated);
  };

  // Financial calculations
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Free delivery for orders >= ₹250 or empty cart
  const deliveryFee = items.length === 0 ? 0 : subtotal >= 250 ? 0 : 20;
  // 5% standard campus food GST/platform service
  const taxes = items.length === 0 ? 0 : Math.round(subtotal * 0.05);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      const rawDiscount = (subtotal * appliedCoupon.discountValue) / 100;
      discount = appliedCoupon.maxDiscount ? Math.min(rawDiscount, appliedCoupon.maxDiscount) : rawDiscount;
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const total = Math.max(0, subtotal + deliveryFee + taxes - discount);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const formattedCode = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code.toUpperCase() === formattedCode);

    if (!found) {
      return { success: false, message: `Coupon "${formattedCode}" is invalid.` };
    }

    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Min order value for ${found.code} is ₹${found.minOrder}. Add items worth ₹${found.minOrder - subtotal} more.`,
      };
    }

    setAppliedCoupon(found);
    storage.set(StorageKeys.COUPON, found);
    return { success: true, message: `Coupon "${found.code}" applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    storage.remove(StorageKeys.COUPON);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        selectedAddress,
        addresses,
        subtotal,
        deliveryFee,
        taxes,
        discount,
        total,
        itemCount,
        activeRestaurantId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setSelectedAddress,
        addAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
