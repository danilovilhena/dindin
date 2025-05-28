import { create } from "zustand";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";
import { databaseService } from "@/lib/database";

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCategories: () => Promise<void>;
  createCategory: (input: CreateCategoryInput) => Promise<void>;
  updateCategory: (input: UpdateCategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await databaseService.getCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load categories",
        isLoading: false,
      });
    }
  },

  createCategory: async (input: CreateCategoryInput) => {
    set({ error: null });
    try {
      const newCategory = await databaseService.createCategory(input);
      set((state) => ({
        categories: [...state.categories, newCategory].sort((a, b) => a.name.localeCompare(b.name)),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create category",
      });
    }
  },

  updateCategory: async (input: UpdateCategoryInput) => {
    set({ error: null });
    try {
      await databaseService.updateCategory(input);
      set((state) => {
        const updatedCategories = state.categories
          .map((cat) => {
            if (cat.id === input.id) {
              return {
                ...cat,
                name: input.name ?? cat.name,
                icon: input.icon ?? cat.icon,
                color: input.color ?? cat.color,
                type: input.type ?? cat.type,
                updatedAt: new Date().toISOString(),
              };
            }
            return cat;
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        return { categories: updatedCategories };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update category",
      });
    }
  },

  deleteCategory: async (id: string) => {
    set({ error: null });
    try {
      await databaseService.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete category",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
