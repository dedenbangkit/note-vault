import { create } from "zustand";
import { db, generateId } from "@/lib/db";
import type { Category } from "@/types";

const DEFAULT_COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
];

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  loadCategories: () => Promise<void>;
  createCategory: (name: string, color?: string) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  clearAllCategories: () => Promise<void>;
  importCategories: (categories: Category[]) => Promise<void>;
  getNextColor: () => string;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: true,

  loadCategories: async () => {
    set({ isLoading: true });
    const categories = await db.categories.toArray();
    set({ categories, isLoading: false });
  },

  createCategory: async (name, color) => {
    const category: Category = {
      id: generateId(),
      name,
      color: color || get().getNextColor(),
      createdAt: Date.now(),
    };
    await db.categories.add(category);
    set((state) => ({ categories: [...state.categories, category] }));
    return category;
  },

  updateCategory: async (id, updates) => {
    await db.categories.update(id, updates);
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    }));
  },

  deleteCategory: async (id) => {
    // Clear categoryId from notes that belong to this category
    await db.notes.where("categoryId").equals(id).modify({ categoryId: null });
    await db.categories.delete(id);
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    }));
  },

  getCategoryById: (id) => {
    return get().categories.find((cat) => cat.id === id);
  },

  clearAllCategories: async () => {
    await db.categories.clear();
    set({ categories: [] });
  },

  importCategories: async (categories) => {
    await db.categories.bulkPut(categories);
    const allCategories = await db.categories.toArray();
    set({ categories: allCategories });
  },

  getNextColor: () => {
    const usedColors = get().categories.map((cat) => cat.color);
    const availableColors = DEFAULT_COLORS.filter(
      (color) => !usedColors.includes(color)
    );
    return availableColors.length > 0
      ? availableColors[0]
      : DEFAULT_COLORS[get().categories.length % DEFAULT_COLORS.length];
  },
}));
