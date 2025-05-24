export interface CategoryInfo {
  slug: string;
  label: string;
  emoji?: string;
  icon?: any; // for image support
  iconSize?: number; // for image support
  gradientColors: string[];
}

export const categoryMap: Record<string, CategoryInfo> = {
  income: {
    slug: "income",
    label: "Renda",
    // emoji: "💰",
    icon: require("@/assets/icons/wallet.png"),
    iconSize: 40,
    gradientColors: ["#4ECDC4", "#16A085"],
  },
  housing: {
    slug: "housing",
    label: "Casa",
    // emoji: "🏠",
    icon: require("@/assets/icons/house.png"),
    iconSize: 56,
    gradientColors: ["#45B7D1", "#2980B9"],
  },
  food: {
    slug: "food",
    label: "Alimentação",
    // emoji: "🍽️",
    icon: require("@/assets/icons/food.png"),
    iconSize: 44,
    gradientColors: ["#FF6B6B", "#E74C3C"],
  },
  transport: {
    slug: "transport",
    label: "Transporte",
    // emoji: "🚗",
    icon: require("@/assets/icons/car.png"),
    iconSize: 44,
    gradientColors: ["#FFEAA7", "#F39C12"],
  },
  health: {
    slug: "health",
    label: "Saúde",
    // emoji: "🏥",
    icon: require("@/assets/icons/hospital.png"),
    iconSize: 44,
    gradientColors: ["#DDA0DD", "#8E44AD"],
  },
  utilities: {
    slug: "utilities",
    label: "Utilidades",
    // emoji: "⚡",
    icon: require("@/assets/icons/tools.png"),
    iconSize: 44,
    gradientColors: ["#81C784", "#27AE60"],
  },
  education: {
    slug: "education",
    label: "Educação",
    // emoji: "🎓",
    icon: require("@/assets/icons/books.png"),
    iconSize: 44,
    gradientColors: ["#FFEAA7", "#F39C12"],
  },
  entertainment: {
    slug: "entertainment",
    label: "Lazer",
    // emoji: "🎬",
    icon: require("@/assets/icons/movie.png"),
    iconSize: 44,
    gradientColors: ["#96CEB4", "#27AE60"],
  },
  others: {
    slug: "others",
    label: "Outros",
    // emoji: "🔗",
    icon: require("@/assets/icons/money.png"),
    iconSize: 44,
    gradientColors: ["#CFD8DC", "#607D8B"],
  },
};
