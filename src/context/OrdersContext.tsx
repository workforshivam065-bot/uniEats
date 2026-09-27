import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Order, OrderStatus, OrderTimelineStep, CartItem, CampusAddress } from '@/types';
import { storage, StorageKeys } from '@/utils/storage';
import { CAMPUS_ADDRESSES } from '@/data/addresses';

interface OrdersContextType {
  orders: Order[];
  activeOrders: Order[];
  pastOrders: Order[];
  placeOrder: (
    items: CartItem[],
    restaurantId: string,
    restaurantName: string,
    restaurantImage: string,
    address: CampusAddress,
    paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash a Delivery' | any,
    subtotal: number,
    deliveryFee: number,
    taxes: number,
    discount: number,
    total: number,
    appliedCoupon?: string
  ) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
  advanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

const buildTimeline = (currentStatus: OrderStatus): OrderTimelineStep[] => {
  const allStatuses: { status: OrderStatus; title: string; desc: string }[] = [
    { status: 'placed', title: 'Order Placed', desc: 'Your order was sent to the kitchen' },
    { status: 'accepted', title: 'Restaurant Accepted', desc: 'Kitchen acknowledged the order' },
    { status: 'preparing', title: 'Food Preparing', desc: 'Chef is cooking your fresh meal' },
    { status: 'out_for_delivery', title: 'Out for Delivery', desc: 'Campus delivery runner is heading to you' },
    { status: 'delivered', title: 'Delivered', desc: 'Handed over at your campus location' },
  ];

  const statusRank: Record<OrderStatus, number> = {
    placed: 1,
    accepted: 2,
    preparing: 3,
    out_for_delivery: 4,
    delivered: 5,
    cancelled: 0,
  };

  const currentRank = statusRank[currentStatus];

  return allStatuses.map((step) => {
    const stepRank = statusRank[step.status];
    return {
      status: step.status,
      title: step.title,
      description: step.desc,
      isCompleted: stepRank < currentRank || (stepRank === currentRank && currentStatus === 'delivered'),
      isCurrent: stepRank === currentRank && currentStatus !== 'delivered',
    };
  });
};

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-10190',
    orderNumber: '#UE10190',
    restaurantId: 'rest-1',
    restaurantName: 'Campus Café',
    restaurantImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    items: [
      {
        cartItemId: 'food-1_base',
        food: {
          id: 'food-1',
          restaurantId: 'rest-1',
          restaurantName: 'Campus Café',
          name: 'Grilled Cheesy Veg Panini',
          description: 'Crispy sourdough bread stuffed with grilled bell peppers and mozzarella.',
          price: 149,
          image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
          category: 'Snacks',
          menuCategory: 'Recommended',
          isVeg: true,
          rating: 4.8,
          ratingCount: 142,
          prepTime: '12 min',
        },
        quantity: 2,
        selectedOptions: [],
        unitPrice: 149,
        totalPrice: 298,
      },
      {
        cartItemId: 'food-2_base',
        food: {
          id: 'food-2',
          restaurantId: 'rest-1',
          restaurantName: 'Campus Café',
          name: 'Iced Caramel Macchiato',
          description: 'Fresh espresso shot with caramel drizzle.',
          price: 129,
          image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
          category: 'Beverages',
          menuCategory: 'Beverages',
          isVeg: true,
          rating: 4.9,
          ratingCount: 210,
          prepTime: '5 min',
        },
        quantity: 1,
        selectedOptions: [],
        unitPrice: 129,
        totalPrice: 129,
      },
    ],
    subtotal: 427,
    deliveryFee: 0,
    taxes: 21,
    discount: 50,
    total: 398,
    appliedCoupon: 'WELCOME',
    deliveryAddress: CAMPUS_ADDRESSES[0],
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    estimatedDeliveryTime: 'Delivered yesterday',
    timeline: buildTimeline('delivered'),
  },
  {
    id: 'ord-10142',
    orderNumber: '#UE10142',
    restaurantId: 'rest-4',
    restaurantName: 'The Burger Lab',
    restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    items: [
      {
        cartItemId: 'food-4_base',
        food: {
          id: 'food-4',
          restaurantId: 'rest-4',
          restaurantName: 'The Burger Lab',
          name: 'Double Smash Crunch Burger',
          description: 'Crispy patty with caramelized onions & cheddar.',
          price: 189,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
          category: 'Burgers',
          menuCategory: 'Recommended',
          isVeg: false,
          rating: 4.9,
          ratingCount: 310,
          prepTime: '15 min',
        },
        quantity: 1,
        selectedOptions: [],
        unitPrice: 189,
        totalPrice: 189,
      },
      {
        cartItemId: 'food-6_base',
        food: {
          id: 'food-6',
          restaurantId: 'rest-4',
          restaurantName: 'The Burger Lab',
          name: 'Peri Peri Loaded Fries',
          description: 'Golden fries dusted with peri-peri mix & cheese.',
          price: 119,
          image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
          category: 'Snacks',
          menuCategory: 'Starters',
          isVeg: true,
          rating: 4.8,
          ratingCount: 260,
          prepTime: '8 min',
        },
        quantity: 1,
        selectedOptions: [],
        unitPrice: 119,
        totalPrice: 119,
      },
    ],
    subtotal: 308,
    deliveryFee: 0,
    taxes: 15,
    discount: 30,
    total: 293,
    appliedCoupon: 'STUDENT10',
    deliveryAddress: CAMPUS_ADDRESSES[1],
    paymentMethod: 'Credit/Debit Card',
    paymentStatus: 'Paid',
    status: 'delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    estimatedDeliveryTime: 'Delivered 3 days ago',
    timeline: buildTimeline('delivered'),
  },
];

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const simulationTimers = useRef<{ [orderId: string]: ReturnType<typeof setTimeout>[] }>({});

  useEffect(() => {
    const hydrateOrders = async () => {
      const stored = await storage.get<Order[]>(StorageKeys.ORDERS, SEED_ORDERS);
      setOrders(stored);
    };
    hydrateOrders();
  }, []);

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    storage.set(StorageKeys.ORDERS, updated);
  };

  const advanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: nextStatus,
            timeline: buildTimeline(nextStatus),
          };
        }
        return ord;
      });
      storage.set(StorageKeys.ORDERS, updated);
      return updated;
    });
  };

  // Schedule automated simulation for an active order
  const scheduleOrderProgression = (orderId: string) => {
    // Clear any existing timers for this order
    if (simulationTimers.current[orderId]) {
      simulationTimers.current[orderId].forEach(clearTimeout);
    }
    simulationTimers.current[orderId] = [];

    const t1 = setTimeout(() => advanceOrderStatus(orderId, 'accepted'), 7000);
    const t2 = setTimeout(() => advanceOrderStatus(orderId, 'preparing'), 16000);
    const t3 = setTimeout(() => advanceOrderStatus(orderId, 'out_for_delivery'), 28000);
    const t4 = setTimeout(() => advanceOrderStatus(orderId, 'delivered'), 45000);

    simulationTimers.current[orderId].push(t1, t2, t3, t4);
  };

  const placeOrder = async (
    items: CartItem[],
    restaurantId: string,
    restaurantName: string,
    restaurantImage: string,
    address: CampusAddress,
    paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery',
    subtotal: number,
    deliveryFee: number,
    taxes: number,
    discount: number,
    total: number,
    appliedCoupon?: string
  ): Promise<Order> => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `#UE${randomSuffix}`;
    const orderId = `ord-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      restaurantId,
      restaurantName,
      restaurantImage,
      items: [...items],
      subtotal,
      deliveryFee,
      taxes,
      discount,
      total,
      appliedCoupon,
      deliveryAddress: address,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      status: 'placed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '20-25 mins',
      timeline: buildTimeline('placed'),
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);

    // Start status simulation pipeline
    scheduleOrderProgression(orderId);

    return newOrder;
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find((o) => o.id === id || o.orderNumber === id);
  };

  const cancelOrder = (id: string) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === id) {
          return {
            ...ord,
            status: 'cancelled' as OrderStatus,
            timeline: buildTimeline('cancelled'),
          };
        }
        return ord;
      });
      storage.set(StorageKeys.ORDERS, updated);
      return updated;
    });
  };

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');

  return (
    <OrdersContext.Provider
      value={{
        orders,
        activeOrders,
        pastOrders,
        placeOrder,
        getOrderById,
        cancelOrder,
        advanceOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
