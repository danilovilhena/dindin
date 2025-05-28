import { icons } from "lucide-react-native";

export type CategoryColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "pink"
  | "indigo"
  | "teal"
  | "orange"
  | "gray"
  | "emerald"
  | "cyan"
  | "amber"
  | "lime"
  | "violet"
  | "rose";

export const CATEGORY_COLORS: Record<CategoryColor, string> = {
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
  teal: "#14B8A6",
  orange: "#F97316",
  gray: "#6B7280",
  emerald: "#059669",
  cyan: "#06B6D4",
  amber: "#D97706",
  lime: "#65A30D",
  violet: "#7C3AED",
  rose: "#F43F5E",
};

export type ExpenseType = "receita" | "gasto";

export type LucideIconName = keyof typeof icons;

export interface Category {
  id: string;
  name: string;
  icon: LucideIconName;
  color: CategoryColor;
  type: ExpenseType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  icon: LucideIconName;
  color: CategoryColor;
  type: ExpenseType;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}
