import {create} from 'zustand';

type FavoriteStore = {
  favorites: Set<number>;
  toggleFavorite: (item_id: number) => void;
};

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  favorites: new Set<number>(),
  toggleFavorite: (item_id) =>
    set((state) => {
      const newFavorites = new Set(state.favorites);
      if (newFavorites.has(item_id)) {
        newFavorites.delete(item_id);
      } else {
        newFavorites.add(item_id);
      }
      return {favorites: newFavorites};
    }),
}));
