import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: string[]; // Project IDs
  toggleFavorite: (projectId: string) => void;
  isFavorite: (projectId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('idat_saved_projects');
      return saved ? JSON.parse(saved) : ['proj-1', 'proj-3']; // Default sample saved
    } catch {
      return ['proj-1', 'proj-3'];
    }
  });

  useEffect(() => {
    localStorage.setItem('idat_saved_projects', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const isFavorite = (projectId: string) => favorites.includes(projectId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
