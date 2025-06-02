"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'recipeAppFavorites';

type FavoriteHookReturnType = {
  favoriteRecipeIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

export function useFavorites(): FavoriteHookReturnType {
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>([]);

  useEffect(() => {
    // Ensure localStorage is accessed only on the client side
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavoriteRecipeIds(JSON.parse(storedFavorites));
      }
    }
  }, []);

  const updateStorage = (ids: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    }
  };

  const addFavorite = useCallback((id: string) => {
    setFavoriteRecipeIds((prevIds) => {
      if (prevIds.includes(id)) return prevIds;
      const newIds = [...prevIds, id];
      updateStorage(newIds);
      return newIds;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavoriteRecipeIds((prevIds) => {
      const newIds = prevIds.filter((favId) => favId !== id);
      updateStorage(newIds);
      return newIds;
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favoriteRecipeIds.includes(id);
  }, [favoriteRecipeIds]);

  const toggleFavorite = useCallback((id: string) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  }, [addFavorite, isFavorite, removeFavorite]);

  return { favoriteRecipeIds, addFavorite, removeFavorite, isFavorite, toggleFavorite };
} 