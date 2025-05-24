import { CategoryInfo, categoryMap } from "@/constants/Categories";
import { colors } from "@/constants/Colors";
import { formatCurrency } from "@/utils/currencyUtils";
import { getRelativeTime } from "@/utils/dateUtils";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

interface ExpenseCardProps {
  transaction: Transaction;
}

// Move styles outside of component for better performance
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconEmoji: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontFamily: "DMSans",
    fontWeight: "500",
    fontSize: 16,
    color: colors.dark.textPrimary,
    marginBottom: 4,
    flexWrap: "wrap",
    lineHeight: 20,
  },
  date: {
    fontFamily: "DMSans",
    fontWeight: "400",
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontFamily: "DMSans",
    fontWeight: "600",
    fontSize: 16,
  },
});

export const ExpenseCard: React.FC<ExpenseCardProps> = React.memo(
  ({ transaction }) => {
    const categoryInfo: CategoryInfo = categoryMap[transaction.category] || {
      slug: "other",
      label: "Outros",
      emoji: "💼",
      gradientColors: [colors.dark.surface, colors.dark.tertiary],
    };

    // Create dynamic styles only when needed
    const iconImageStyle = {
      width: categoryInfo.iconSize,
      height: categoryInfo.iconSize,
      resizeMode: "contain" as const,
    };

    const amountStyle = [
      styles.amount,
      {
        color: transaction.amount > 0 ? "#4ECDC4" : colors.dark.textPrimary,
      },
    ];

    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          {categoryInfo.icon ? (
            <Image source={categoryInfo.icon} style={iconImageStyle} />
          ) : (
            <Text style={styles.iconEmoji}>{categoryInfo.emoji}</Text>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {transaction.title}
          </Text>
          <Text style={styles.date}>{getRelativeTime(transaction.date)}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={amountStyle}>
            {transaction.amount > 0 ? "+" : ""}
            {formatCurrency(transaction.amount)}
          </Text>
        </View>
      </View>
    );
  }
);
