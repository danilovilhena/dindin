export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePaymentMethodInput {
  id: string;
  enabled: boolean;
}

export const PAYMENT_METHODS = [
  { name: "Pix", icon: "Pix" },
  { name: "Cartão de Crédito", icon: "CreditCard" },
  { name: "Cartão de Débito", icon: "CreditCard" },
  { name: "Dinheiro", icon: "Banknote" },
  { name: "Boleto", icon: "FileText" },
] as const;
