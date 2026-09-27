import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, StorageKeys } from '@/utils/storage';

interface FavoritesContextType {
  favoriteFoodIds: string[];
  favoriteRestaurantIds: string[];
  toggleFavoriteFood: (foodId: string) => void;
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  isFavoriteFood: (foodId: string) => boolean;
  isFavoriteRestaurant: (restaurantId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>(['food-1', 'food-4', 'food-13']);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(['rest-1', 'rest-4']);

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFoods = await storage.get<string[]>(StorageKeys.FAVORITES_FOOD, ['food-1', 'food-4', 'food-13']);
      const storedRests = await storage.get<string[]>(StorageKeys.FAVORITES_RESTAURANTS, ['rest-1', 'rest-4']);
      setFavoriteFoodIds(storedFoods);
      setFavoriteRestaurantIds(storedRests);
    };
    loadFavorites();
  }, []);

  const toggleFavoriteFood = (foodId: string) => {
    setFavoriteFoodIds((prev) => {
      const next = prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId];
      storage.set(StorageKeys.FAVORITES_FOOD, next);
      return next;
    });
  };

  const toggleFavoriteRestaurant = (restaurantId: string) => {
    setFavoriteRestaurantIds((prev) => {
      const next = prev.includes(restaurantId) ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId];
      storage.set(StorageKeys.FAVORITES_RESTAURANTS, next);
      return next;
    });
  };

  const isFavoriteFood = (foodId: string) => favoriteFoodIds.includes(foodId);
  const isFavoriteRestaurant = (restaurantId: string) => favoriteRestaurantIds.includes(restaurantId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteFoodIds,
        favoriteRestaurantIds,
        toggleFavoriteFood,
        toggleFavoriteRestaurant,
        isFavoriteFood,
        isFavoriteRestaurant,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
