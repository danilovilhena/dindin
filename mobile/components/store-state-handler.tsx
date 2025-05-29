import { seedCategories } from "@/lib/seedData";
import { useCategoryStore } from "@/stores/categoryStore";
import { usePaymentMethodStore } from "@/stores/paymentMethodStore";
import { useEffect } from "react";

export const StoreStateHandler = () => {
  const { loadCategories } = useCategoryStore();
  const { loadPaymentMethods } = usePaymentMethodStore();

  useEffect(() => {
    const initializeCategories = async () => {
      await seedCategories();
      await loadCategories();
      await loadPaymentMethods();
    };
    initializeCategories();
  }, [loadCategories]);

  return null;
};
