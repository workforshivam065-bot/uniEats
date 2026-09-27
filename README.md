# UniEats 🎓🍔

> **A campus-first food ordering mobile application built with React Native, Expo, and TypeScript.**

UniEats is an intuitive mobile application designed specifically for university students. It solves the everyday campus struggle: ordering quick, hot, and budget-friendly food from campus canteens, hostels, and cafes directly to dorm rooms, study halls, or campus lawns.

Built with **React Native**, **Expo Router**, **TypeScript**, and **React Context API with AsyncStorage**, UniEats follows production-grade architectural patterns that make it ideal for portfolio demonstration and internship technical interviews.

---

## 📱 App Highlights & Features

### 1. Campus Feed & Discovery
- **Personalized Header**: Dynamic greeting (Good morning / afternoon / evening) based on time of day, student profile display, and active campus drop-off location switcher (Hostel Blocks, Central Library, Tech Labs).
- **Promotional Offers**: Campus-exclusive banners highlighting student discounts like `UNI20` (20% OFF).
- **Categories**: Horizontal scrolling categories with custom icons (Pizza, Burgers, Indian, Chinese, Snacks, Beverages, Desserts, Healthy) with instant filtering.
- **Featured Campus Outlets**: Rich cards for campus favorites like *Campus Café*, *The Food Court*, *Hostel Kitchen*, *The Burger Lab*, *Spice Corner*, and *Chai Point* displaying ratings, prep times, open/closed status, and price tiers.
- **Popular Campus Food**: Quick add carousel with dietary indicators and live stepper controls.

### 2. Search & Multi-Criteria Filtering
- Real-time search matching dishes, ingredients, and canteen names.
- Instant filter pills: Pure Veg 🌱, Non-Veg 🍗, High Rating (4.5+ ⭐), and Fast Prep (<20 mins ⚡).
- Bottom sheet filter modal supporting category filtering and price sorting (low-to-high / high-to-low).
- Recent searches caching and trending campus food suggestions.

### 3. Outlet Menu & Live Food Customization
- **Categorized Menus**: Switch easily between *Recommended*, *Starters*, *Main Course*, *Snacks*, *Beverages*, and *Desserts*.
- **Veg-Only Toggle**: Instant filter for vegetarian students.
- **Meal Customization Modal**: Real-time add-on selections (extra cheese, sauces, spice levels, toppings) with dynamic price calculation: `(basePrice + selectedAddons) * quantity`.
- **Floating Cart Bar**: Real-time preview of active cart totals and quick navigation.

### 4. Smart Cart & Coupon Engine
- Quantity controls with automatic line-item calculation.
- Coupon engine supporting percentage discounts, caps, and minimum order values (`UNI20`, `STUDENT10`, `WELCOME`).
- Transparent bill breakdown: Item total, Campus Delivery Fee (free above ₹250), Taxes (5% GST), and Net Payable.
- Campus delivery guarantee notice and delightful empty states with direct search redirection.

### 5. Campus Checkout & Mock Payments
- Delivery location selector (switch between dorm room, silent reading room, or tech labs, or add a custom drop-off spot).
- Delivery instructions / runner note field.
- Simulated payment options: Student Instant UPI (Google Pay / PhonePe / Paytm), Campus Meal Card, and Cash on Delivery.
- Order creation producing unique tracking IDs (e.g. `#UE10294`).

### 6. Real-Time Simulated Order Tracking
- Visual step-by-step timeline:
  1. *Order Placed*
  2. *Restaurant Accepted*
  3. *Food Preparing*
  4. *Out for Delivery*
  5. *Delivered*
- Automatic background simulation advancing orders through their lifecycle for realistic prototyping.
- Campus runner contact card and direct call/help triggers.

### 7. Order History, Favorites & Student Profile
- **Orders Tab**: Segmented view for *Active Orders* and *Past Orders* with one-click **Reorder** functionality.
- **Favorites Tab**: Dual-tab view for liked dishes and favorite campus outlets.
- **Student Profile**: Roll number display (`UE-2024-CS089`), campus statistics (orders placed, favorites, UniPoints), address book, payment mock credentials, and guest mode.
- **Notification Center**: Real-time alerts for order status transitions and campus promo drops.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 57) |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation with tabs & modals) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict typing across models, props, and states) |
| **State Management** | React Context API (`AuthContext`, `CartContext`, `OrdersContext`, `FavoritesContext`, `NotificationContext`) |
| **Persistence** | `@react-native-async-storage/async-storage` for offline session caching |
| **Icons & Styling** | `@expo/vector-icons` (Ionicons) + Vanilla React Native `StyleSheet` Design System |
| **Safe Areas** | `react-native-safe-area-context` for universal device edge handling |

---

## 📂 Project Architecture

```
UniEats/
├── src/
│   ├── app/                      # Expo Router file-based route hierarchy
│   │   ├── _layout.tsx           # Global provider tree (Auth, Cart, Orders, Favorites)
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx         # Student email/password & Guest entry
│   │   │   └── signup.tsx        # Registration with roll number
│   │   ├── (tabs)/               # Bottom tab navigation
│   │   │   ├── _layout.tsx       # Custom styled tab bar with badges
│   │   │   ├── index.tsx         # Home screen
│   │   │   ├── search.tsx        # Search & filters
│   │   │   ├── orders.tsx        # Active & past orders
│   │   │   ├── favorites.tsx     # Liked foods & restaurants
│   │   │   └── profile.tsx       # Student profile & stats
│   │   ├── restaurant/[id].tsx   # Restaurant details & categorized menu
│   │   ├── food/[id].tsx         # Food detail & customization modal
│   │   ├── cart.tsx              # Cart overview & coupon engine
│   │   ├── checkout.tsx          # Campus delivery & simulated payment
│   │   ├── order/[id].tsx        # Real-time order tracking timeline
│   │   └── notifications.tsx     # Notification center
│   ├── components/               # Modular, reusable UI components
│   │   ├── common/               # Button, Header, SearchBar, RatingBadge, DietaryBadge, EmptyState, LoadingState, QuantitySelector
│   │   ├── restaurant/           # RestaurantCard
│   │   ├── food/                 # FoodCard
│   │   ├── cart/                 # CartItemRow, CouponInput, PriceBreakdown
│   │   ├── home/                 # CategoryCard
│   │   └── order/                # OrderCard, OrderTimeline
│   ├── context/                  # Centralized state management
│   │   ├── AuthContext.tsx       # User authentication & guest state
│   │   ├── CartContext.tsx       # Cart actions, quantities, coupon logic & totals
│   │   ├── OrdersContext.tsx     # Order history & status simulation engine
│   │   ├── FavoritesContext.tsx  # Liked foods and outlets
│   │   └── NotificationContext.tsx# Notifications & unread counts
│   ├── constants/
│   │   └── theme.ts              # Design tokens (Colors, Typography, Spacing, Shadows, Radii)
│   ├── data/                     # Realistic campus mock datasets
│   │   ├── restaurants.ts        # Campus canteens & cafes
│   │   ├── foods.ts              # Food items with customizations
│   │   ├── categories.ts         # Food categories
│   │   ├── coupons.ts            # Student discount coupons
│   │   ├── addresses.ts          # Dormitories and academic halls
│   │   └── notifications.ts      # Sample notifications
│   ├── types/
│   │   └── index.ts              # TypeScript domain interfaces
│   └── utils/
│       ├── formatters.ts         # Currency and date/time formatters
│       └── storage.ts            # Safe AsyncStorage wrappers
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Expo Go app on your iOS or Android phone (or an emulator/browser)

### Installation

1. **Clone or navigate to the repository**:
   ```bash
   cd "UniEats React native project"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**:
   - **Web Browser**: Press `w` in the terminal or run `npx expo start --web`
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Physical Device**: Scan the terminal QR code using the **Expo Go** app

---

## 💡 Interview Talking Points

When explaining UniEats in a technical or portfolio interview:

1. **Architecture & Separation of Concerns**:
   - The UI components (`src/components/`) are pure, presentation-focused components with zero hardcoded business logic.
   - Business state (Cart calculations, active discounts, order lifecycle) lives in decoupled Context providers (`src/context/`).
   - The mock data layer is isolated in `src/data/`, meaning a real backend (e.g. Supabase, Firebase, or Node.js/PostgreSQL) can be plugged in by swapping the context data calls without altering any UI screens.

2. **State Management & Persistence**:
   - Instead of pulling in heavy external state libraries (like Redux or MobX), UniEats utilizes React's built-in **Context API** paired with custom hooks (`useCart`, `useOrders`, `useAuth`, `useFavorites`).
   - Key student states (cart contents, past orders, favorites, and saved dorm addresses) are automatically persisted across app restarts using **AsyncStorage**.

3. **File-Based Routing with Expo Router**:
   - Leverage Expo Router for modern URL-like navigation hierarchy:
     - Group routes: `(tabs)` and `(auth)`
     - Dynamic route segments: `restaurant/[id].tsx`, `food/[id].tsx`, `order/[id].tsx`
     - Modals and stack transitions defined declaratively.

4. **Realistic Micro-Interactions & Prototyping**:
   - Live order lifecycle ticker: orders simulate advancing through "Order Placed" → "Restaurant Accepted" → "Food Preparing" → "Out for Delivery" → "Delivered" automatically with timers.
   - Dynamic meal pricing that immediately recalculates when students toggle extra cheese, sauces, or spice levels.

---

## 🔮 Future Roadmap

- [ ] **Backend Integration**: Supabase or Firebase Authentication, PostgreSQL database, and Row-Level Security (RLS).
- [ ] **Real-Time WebSockets**: Live GPS coordinates for campus runners via Socket.io / Supabase Realtime.
- [ ] **Payment Gateway**: Integration with Razorpay / Stripe for real UPI and card processing.
- [ ] **Canteen Partner Dashboard**: Web portal for campus kitchen managers to accept/reject incoming orders and manage daily menus.
- [ ] **Runner Companion App**: Mobile app for student delivery partners to accept drop-offs and mark orders delivered.

---

## 👨‍💻 Author

**Shivam Singh**  
*Computer Science & Engineering Student*  
*UniEats Developer & Maintainer*
