export interface Category {
  id: string;
  name: string;
  iconName: string;
  image?: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  group: 'Add-ons' | 'Sauce' | 'Spice Level' | 'Preferences';
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  menuCategory: 'Recommended' | 'Starters' | 'Main Course' | 'Snacks' | 'Beverages' | 'Desserts';
  isVeg: boolean;
  isPopular?: boolean;
  rating: number;
  ratingCount: number;
  calories?: number;
  prepTime: string;
  customizationOptions?: CustomizationOption[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  distance: string;
  priceIndicator: '₹' | '₹₹' | '₹₹₹';
  category: string;
  isOpen: boolean;
  openingHours: string;
  location: string;
  featured?: boolean;
  offerBadge?: string;
}

export interface CartItem {
  cartItemId: string;
  food: FoodItem;
  quantity: number;
  selectedOptions: CustomizationOption[];
  unitPrice: number;
  totalPrice: number;
}

export interface CampusAddress {
  id: string;
  title: string; // e.g. "Hostel Block A"
  room: string;  // e.g. "Room 304"
  landmark?: string;
  campusZone: string; // e.g. "North Campus"
  isDefault?: boolean;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscount?: number;
  minOrder: number;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  title: string;
  description: string;
  time?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#UE10294"
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  appliedCoupon?: string;
  deliveryAddress: CampusAddress;
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  timeline: OrderTimelineStep[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  campus: string;
  department: string;
  phone: string;
  avatarUrl: string;
  isGuest?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'promo' | 'system';
  isRead: boolean;
  orderId?: string;
}
