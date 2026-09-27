# 🎬 UniEats: 6-7 Minute Video Presentation Script

> **A step-by-step presentation script designed for portfolio videos, LinkedIn demos, and internship technical interviews.**
> **Total Duration:** 6 to 7 minutes (~950 – 1,050 spoken words at a comfortable conversational pace of 140–150 wpm).

---

## ⏱️ Video Timeline Overview

| Timestamp | Section | Key Focus |
| :--- | :--- | :--- |
| **0:00 – 0:45** | **1. Introduction & The Problem** | Who you are, the campus food problem, and what UniEats is. |
| **0:45 – 1:30** | **2. Home Screen & Campus Discovery** | Dynamic greetings, campus location selector, categories, and featured canteens. |
| **1:30 – 2:30** | **3. Search, Smart Filters & Menus** | Instant search, Pure Veg toggle, price filters, and categorized menus. |
| **2:30 – 3:30** | **4. Live Customization & Smart Cart** | Add-on pricing calculation, quantity steppers, and the `UNI20` coupon engine. |
| **3:30 – 4:30** | **5. Checkout & Real-Time Order Tracking** | Campus dorm drop-off, simulated payment, and live stepped timeline. |
| **4:30 – 5:45** | **6. Codebase Architecture & Technical Deep Dive** | Expo Router structure, Context API state management, TypeScript models, & AsyncStorage. |
| **5:45 – 6:30** | **7. Future Roadmap & Conclusion** | Supabase/Firebase backend, real-time GPS, and closing call to action. |

---

## 🎥 Recording & Screen Setup Tips

1. **Screen Layout**:
   - **Option A (Split Screen)**: 40% Mobile Simulator / Web App on the left + 60% VS Code editor on the right.
   - **Option B (Full Focus)**: Full screen on the App for Sections 1–5, then switch full screen to VS Code for Section 6.
2. **Audio & Pacing**:
   - Speak in a confident, conversational tone. Don't rush; pause for 1 second between major screen transitions.
3. **App State**:
   - Have the development server running (`npx expo start --web` or running in an iOS/Android simulator or Expo Go on your phone).

---

# 🎙️ Complete Word-for-Word Script

---

### Part 1: Introduction & Problem Statement (0:00 – 0:45)

**[Screen Action]**  
*Camera on you or starting on the UniEats splash/home screen on the mobile simulator.*

**[What to Say]**  
> *"Hi everyone! My name is **Shivam Singh**, and today I am excited to present **UniEats** — a modern, campus-first food ordering mobile application built with **React Native**, **Expo Router**, and **TypeScript**.*  
>  
> *As university students, we often struggle during late-night study sessions or packed lecture days with ordering food quickly to our specific hostel block, reading hall, or lab. Existing commercial apps are built for city addresses, not college campuses.*  
>  
> *I built UniEats to solve this exact problem: providing students with a fast, intuitive mobile experience to browse campus canteens, customize their meals with instant pricing, apply student discounts, and track runner deliveries directly to their dorm room.*  
>  
> *Let's jump right into the live app demo!"*

---

### Part 2: Home Screen & Campus Discovery (0:45 – 1:30)

**[Screen Action]**  
*Show the Home screen. Highlight the top bar, tap the campus location dropdown, scroll categories, and show featured canteens.*

**[What to Say]**  
> *"Here on the **Home Screen**, the app immediately feels personalized. At the top, you'll see a dynamic greeting that automatically adjusts — whether it's 'Good morning' or 'Good evening' — alongside the student's name.*  
>  
> *Right below the greeting is our **Campus Location Picker**. Students don't have street addresses — they have dorm rooms. When I tap this, a bottom sheet appears letting the student switch their delivery spot between **Hostel Block A**, the **Central Library Reading Hall**, or the **Engineering Labs**.*  
>  
> *Next, we have our **Campus Exclusive Promo Banner**, currently featuring 20% off with coupon code `UNI20`.*  
>  
> *Below that, students can horizontally scroll through **Food Categories** — from Pizza and Burgers to Desi Indian, Healthy bowls, and Chai. Tapping any category instantly filters our featured campus outlets like **Campus Café**, **The Burger Lab**, and **Chai Point**, showing ratings, delivery times, and open or closed badges."*

---

### Part 3: Search, Multi-Filters & Menu Exploration (1:30 – 2:30)

**[Screen Action]**  
*Tap the Search tab or search bar. Type "Burger", tap the "Pure Veg" filter pill, then tap into "The Burger Lab" restaurant.*

**[What to Say]**  
> *"Now let's head over to the **Search Screen**. It's built for speed. Students can tap popular quick-tags like 'Burger', 'Kulhad Chai', or 'Maggi', or type directly into the search bar.*  
>  
> *Notice how responsive the search is: it simultaneously searches through both **restaurants** and **individual dishes** in real-time.*  
>  
> *Campus dietary preferences are very important, so I implemented instant filter pills. With one tap on **🌱 Pure Veg**, the list immediately filters to only 100% vegetarian options. We can also filter by ratings of 4.5+ or preparation times under 20 minutes.*  
>  
> *Let's tap into **The Burger Lab**. The restaurant screen features a high-res cover hero, operating hours, and a categorized menu tab bar — Recommended, Starters, and Main Courses. Every dish clearly displays Indian dietary markers — green for veg, red for non-veg — along with ratings and descriptions."*

---

### Part 4: Live Meal Customization & Smart Cart Engine (2:30 – 3:30)

**[Screen Action]**  
*Tap on a food item like "Double Smash Crunch Burger" or "Grilled Cheesy Veg Panini". Select add-ons (extra cheese, sauce), increase quantity, and tap "Add to Cart". Then open the Cart screen and apply coupon `UNI20`.*

**[What to Say]**  
> *"Students love customizing their food, so let's tap on the **Double Smash Crunch Burger**.*  
>  
> *This opens a clean **Food Details modal**. Here, students can pick their spice level, add extra cheddar cheese, or select secret sauce dips.*  
>  
> *Watch the price bar at the bottom: as I toggle these add-on options, the total price **recalculates dynamically in real time** using our formula: `(base price + add-ons) × quantity`. Let's set the quantity to 2 and tap **Add to Cart**.*  
>  
> *A subtle confirmation animation plays, and our floating cart bar appears. Let's tap **View Cart**.*  
>  
> *In the **Cart Screen**, we can adjust item quantities or delete items. Below the items is our **Coupon Engine**. If I enter `UNI20` and hit Apply, the engine checks eligibility against the minimum order value and dynamically applies a 20% discount, updating the final bill summary with transparent taxes and delivery charges."*

---

### Part 5: Campus Checkout & Real-Time Order Tracking (3:30 – 4:30)

**[Screen Action]**  
*Tap "Proceed to Checkout". Select campus delivery location and UPI payment. Tap "Place Order". Watch the app transition to the Order Tracking timeline.*

**[What to Say]**  
> *"Now, let's tap **Proceed to Checkout**.*  
>  
> *On this screen, students can verify their drop-off location, add special delivery instructions for the student runner — like 'Call when outside hostel gate' — and choose their payment method.*  
>  
> *We have simulated options for **Student UPI**, **Campus Meal Cards**, and **Cash on Delivery**. Let's select UPI and tap **Place Order**.*  
>  
> *The cart clears, and we are immediately taken to the **Order Tracking Screen** with a unique order number — `#UE10294`.*  
>  
> *Notice our stepped delivery timeline: **Order Placed** → **Restaurant Accepted** → **Food Preparing** → **Out for Delivery** → **Delivered**.*  
>  
> *For this prototype, I engineered a built-in simulation ticker using background timers. You can see the status badge update live, while displaying the runner's contact info and delivery countdown.*  
>  
> *If we go to the **Orders Tab**, this order is listed under **Active Orders**. Our completed orders appear under **Previous Orders**, each with a one-tap **Reorder** button that instantly re-populates the cart."*

---

### Part 6: Code Architecture & Technical Deep Dive (4:30 – 5:45)

**[Screen Action]**  
*Switch to VS Code. Show the folder structure (`src/app`, `src/context`, `src/types`, `src/components`). Open `src/context/CartContext.tsx` and `src/types/index.ts`.*

**[What to Say]**  
> *"Now let's look under the hood at the code architecture. I designed UniEats with clean, scalable, and interview-ready code principles.*  
>  
> *First, we are using **Expo Router** inside `src/app/`. This gives us file-based routing: route groups like `(tabs)` and `(auth)` keep our tab navigation and authentication separate, while dynamic routes like `restaurant/[id].tsx` and `food/[id].tsx` make screen transitions clean and modular.*  
>  
> *Second, for state management, instead of introducing heavy external dependencies like Redux, I used React's native **Context API** combined with custom hooks:*  
> - *`CartContext` manages line items, add-on combinations, subtotal math, and coupon validations.*  
> - *`OrdersContext` handles active and past order history along with the automated status progression timers.*  
> - *`FavoritesContext` and `AuthContext` handle saved meals and student profile state.*  
>  
> *Third, **persistence**: We integrated **AsyncStorage**. When a student closes or refreshes the app, their cart, favorites, order history, and selected dorm address are automatically restored.*  
>  
> *Fourth, **TypeScript**: If we look at `src/types/index.ts`, every single entity — from `Restaurant` and `FoodItem` to `CartItem` and `OrderTimelineStep` — is strictly typed. There are zero implicit `any` types in this project.*  
>  
> *Finally, our UI components in `src/components/` are completely decoupled from the data layer. The mock datasets in `src/data/` mirror standard REST or GraphQL payloads. That means when we connect a real backend like **Supabase** or **Firebase**, we can plug in the API services into our Contexts without rewriting any UI screens!"*

---

### Part 7: Future Roadmap & Closing (5:45 – 6:30)

**[Screen Action]**  
*Switch back to the mobile app, navigate to the **Profile** screen showing the student ID and UniPoints, then show the README on screen.*

**[What to Say]**  
> *"Looking ahead, the roadmap for UniEats includes:*  
> 1. *Connecting **Supabase Authentication** with institutional student email verification.*  
> 2. *Integrating **WebSockets** for live GPS tracking of student delivery runners across campus.*  
> 3. *And building a dedicated **Canteen Kitchen Dashboard** for campus vendors to update their daily menus.*  
>  
> *In summary, UniEats demonstrates full-stack mobile engineering fundamentals — from file-based navigation, state management, and local storage to polished UI/UX and clean TypeScript architecture.*  
>  
> *The entire source code is available on GitHub with a comprehensive README. Thank you so much for watching, and I look forward to answering any questions!"*

---

## 🎯 Quick Interview Q&A Cheatsheet

If an interviewer asks follow-up questions about your video demo, keep these concise points handy:

#### Q1: "Why did you choose React Context over Redux or Zustand?"
> *"For an application of this scale, React Context with custom hooks provides all the global state we need without the boilerplate of Redux. By breaking our state into isolated contexts (`CartContext`, `OrdersContext`, `FavoritesContext`), components only re-render when their specific data slice changes. It keeps the bundle size lean and beginner-friendly."*

#### Q2: "How does the Cart avoid duplicate items when customizations differ?"
> *"Every cart item receives a composite key: `${food.id}_${selectedOptionIds.sort().join('-')}`. If a student adds a burger with extra cheese and another burger without cheese, the app treats them as distinct line items with separate quantities and unit totals."*

#### Q3: "How does the app handle offline persistence?"
> *"We wrapped AsyncStorage in a typed helper (`src/utils/storage.ts`) with try-catch safety. On mount, our Context providers hydrate their initial state from local storage and synchronize whenever an action like `addToCart` or `placeOrder` occurs."*

#### Q4: "How is the app prepared for backend integration?"
> *"Our data structures in `src/types/index.ts` and `src/data/` already follow relational database schemas. To connect Supabase, we would simply replace the local storage setters in our Context providers with Supabase client queries (`supabase.from('orders').insert(...)`)."*
