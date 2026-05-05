import { create } from "zustand";

interface UIStore {
  selectedNoteId: string | null;
  activeCategoryId: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  isImportModalOpen: boolean;

  setSelectedNoteId: (id: string | null) => void;
  setActiveCategoryId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
  toggleDarkMode: () => void;
  setIsDarkMode: (isDark: boolean) => void;
  toggleSidebar: () => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsImportModalOpen: (isOpen: boolean) => void;
  initializeDarkMode: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  selectedNoteId: null,
  activeCategoryId: null,
  searchQuery: "",
  isSearchOpen: false,
  isDarkMode: false,
  isSidebarOpen: true,
  isImportModalOpen: false,

  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  setActiveCategoryId: (id) => set({ activeCategoryId: id, selectedNoteId: null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setIsSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

  toggleDarkMode: () => {
    const newMode = !get().isDarkMode;
    set({ isDarkMode: newMode });
    if (typeof window !== "undefined") {
      localStorage.setItem("note-vault-dark-mode", JSON.stringify(newMode));
      document.documentElement.classList.toggle("dark", newMode);
    }
  },

  setIsDarkMode: (isDark) => {
    set({ isDarkMode: isDark });
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }
  },

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  setIsImportModalOpen: (isOpen) => set({ isImportModalOpen: isOpen }),

  initializeDarkMode: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("note-vault-dark-mode");
      const isDark = stored
        ? JSON.parse(stored)
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      get().setIsDarkMode(isDark);
    }
  },
}));
