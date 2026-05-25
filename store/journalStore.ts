import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JournalPage } from '@/types';

interface JournalState {
  pages: JournalPage[];
  currentPageIndex: number;
  isOpen: boolean;
  setPages: (pages: JournalPage[]) => void;
  addPage: (page: JournalPage) => void;
  setCurrentPageIndex: (index: number) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      pages: [],
      currentPageIndex: 0,
      isOpen: false,

      setPages: (pages) => set({ pages }),
      addPage: (page) => set((state) => ({ pages: [...state.pages, page] })),
      setCurrentPageIndex: (currentPageIndex) => set({ currentPageIndex }),
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ pages: state.pages }),
    }
  )
);
