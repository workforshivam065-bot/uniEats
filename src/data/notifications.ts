import { NotificationItem } from '@/types';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Order Delivered! 🎉',
    message: 'Your order #UE10190 from Campus Café was delivered to Hostel Block A Room 304. Enjoy your meal!',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    type: 'order',
    isRead: false,
    orderId: 'UE10190',
  },
  {
    id: 'notif-2',
    title: '20% OFF on your next order! 🍔',
    message: 'Use code UNI20 at checkout for 20% off all burgers, paninis and campus meals today.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: 'promo',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Chai Point is open late ☕',
    message: 'Preparing for exams? Chai Point is brewing fresh kulhad chai until 2:00 AM near Central Library.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    type: 'system',
    isRead: true,
  },
  {
    id: 'notif-4',
    title: 'Welcome to UniEats! 🎓',
    message: 'Order quick, affordable, and piping hot food directly to your dorm, reading room, or campus lawn.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: 'system',
    isRead: true,
  },
];
