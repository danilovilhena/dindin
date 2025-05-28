import { seedCategories } from "@/lib/seedData";
import { useCategoryStore } from "@/stores/categoryStore";
import { useEffect } from "react";

export const StoreStateHandler = () => {
  const { loadCategories } = useCategoryStore();

  useEffect(() => {
    const initializeCategories = async () => {
      await seedCategories();
      await loadCategories();
    };
    initializeCategories();
  }, [loadCategories]);

  return null;
};
