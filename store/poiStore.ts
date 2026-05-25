import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { POI, POICategory, DailyHighlight } from '@/types';

interface POIState {
  pois: POI[];
  dailyHighlight: DailyHighlight | null;
  selectedCategory: POICategory | null;
  searchQuery: string;
  setPOIs: (pois: POI[]) => void;
  setDailyHighlight: (highlight: DailyHighlight | null) => void;
  setSelectedCategory: (category: POICategory | null) => void;
  setSearchQuery: (query: string) => void;
  filteredPOIs: () => POI[];
}

export const usePOIStore = create<POIState>()(
  persist(
    (set, get) => ({
      pois: [],
      dailyHighlight: null,
      selectedCategory: null,
      searchQuery: '',

      setPOIs: (pois) => set({ pois }),
      setDailyHighlight: (dailyHighlight) => set({ dailyHighlight }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      filteredPOIs: () => {
        const { pois, selectedCategory, searchQuery } = get();
        return pois.filter((poi) => {
          const matchesCategory = !selectedCategory || poi.category === selectedCategory;
          const matchesSearch =
            !searchQuery ||
            poi.name.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        });
      },
    }),
    {
      name: 'poi-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ pois: state.pois, dailyHighlight: state.dailyHighlight }),
    }
  )
);
