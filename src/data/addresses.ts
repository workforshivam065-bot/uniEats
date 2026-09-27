import { CampusAddress } from '@/types';

export const CAMPUS_ADDRESSES: CampusAddress[] = [
  {
    id: 'addr-1',
    title: 'Hostel Block A (Aryabhata)',
    room: 'Room 304, 3rd Floor',
    landmark: 'Near North Gate Elevator',
    campusZone: 'North Campus',
    isDefault: true,
  },
  {
    id: 'addr-2',
    title: 'Central Library',
    room: 'Silent Reading Hall 2, 2nd Floor',
    landmark: 'Behind Reference Desk',
    campusZone: 'Main Quadrangle',
    isDefault: false,
  },
  {
    id: 'addr-3',
    title: 'Engineering Block 3',
    room: 'AI & Robotics Lab, Room 102',
    landmark: 'Ground Floor East Wing',
    campusZone: 'Tech Campus',
    isDefault: false,
  },
  {
    id: 'addr-4',
    title: 'Student Activity Center',
    room: 'Club Room 4',
    landmark: 'Opposite Cafeteria',
    campusZone: 'Central Hub',
    isDefault: false,
  },
];
