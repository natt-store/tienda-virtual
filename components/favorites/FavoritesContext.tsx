"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/useProducts";

type FavoritesContextType = {
  favorites: Product[];
  favoriteIds: number[];
  totalFavorites: number;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<
  FavoritesContextType | undefined
>(undefined);

const FAVORITES_STORAGE_KEY = "natt-store-favoritos";

export function FavoritesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar favoritos del localStorage y validarlos contra Supabase
  useEffect(() => {
    async function loadAndValidateFavorites() {
      try {
        const savedFavorites = window.localStorage.getItem(
          FAVORITES_STORAGE_KEY
        );

        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);

          if (Array.isArray(parsedFavorites) && parsedFavorites.length > 0) {
            const ids = parsedFavorites.map((p: Product) => p.id);

            // Consultar a Supabase cuáles de estos IDs siguen activos y existen
            const { data, error } = await supabase
              .from("productos")
              .select("*")
              .in("id", ids)
              .eq("active", true);

            if (!error && data) {
              // Mapear solo los que realmente siguen existiendo en la base de datos
              const validProducts: Product[] = data.map((p: any) => ({
                ...p,
                href: `/tienda/producto/${p.id}`,
              }));
              setFavorites(validProducts);
            } else {
              setFavorites([]);
            }
          }
        }
      } catch {
        setFavorites([]);
      } finally {
        setIsLoaded(true);
      }
    }

    loadAndValidateFavorites();
  }, []);

  // Guardar en localStorage cada vez que cambien los favoritos
  useEffect(() => {
    if (!isLoaded) return;

    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites)
      );
    } catch {
      // Los favoritos siguen funcionando durante la sesión.
    }
  }, [favorites, isLoaded]);

  const isFavorite = (productId: number) => {
    return favorites.some((product) => product.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    setFavorites((currentFavorites) => {
      const alreadyFavorite = currentFavorites.some(
        (item) => item.id === product.id
      );

      if (alreadyFavorite) {
        return currentFavorites.filter(
          (item) => item.id !== product.id
        );
      }

      return [...currentFavorites, product];
    });
  };

  const removeFavorite = (productId: number) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter((item) => item.id !== productId)
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const favoriteIds = useMemo(
    () => favorites.map((product) => product.id),
    [favorites]
  );

  const value = {
    favorites,
    favoriteIds,
    totalFavorites: favorites.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe utilizarse dentro de FavoritesProvider"
    );
  }

  return context;
}