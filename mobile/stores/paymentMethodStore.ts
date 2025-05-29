import { create } from "zustand";
import { PaymentMethod, UpdatePaymentMethodInput } from "@/types/paymentMethod";
import { databaseService } from "@/lib/database";

interface PaymentMethodState {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadPaymentMethods: () => Promise<void>;
  updatePaymentMethod: (input: UpdatePaymentMethodInput) => Promise<void>;
  clearError: () => void;
}

export const usePaymentMethodStore = create<PaymentMethodState>((set) => ({
  paymentMethods: [],
  isLoading: false,
  error: null,

  loadPaymentMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      const paymentMethods = await databaseService.getPaymentMethods();
      set({ paymentMethods, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load payment methods",
        isLoading: false,
      });
    }
  },

  updatePaymentMethod: async (input: UpdatePaymentMethodInput) => {
    set({ error: null });
    try {
      await databaseService.updatePaymentMethod(input);
      set((state) => ({
        paymentMethods: state.paymentMethods.map((method) => {
          if (method.id === input.id) {
            return {
              ...method,
              enabled: input.enabled,
              updatedAt: new Date().toISOString(),
            };
          }
          return method;
        }),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update payment method",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
