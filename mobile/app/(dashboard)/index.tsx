import { ExpenseCard } from "@/components/ExpenseCard";
import { colors } from "@/constants/Colors";
import { formatCurrency } from "@/utils/currencyUtils";
import { useAuth } from "@clerk/clerk-expo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Supermercado Extra",
    amount: -150.5,
    date: "2024-05-15",
    category: "food",
  },
  {
    id: "2",
    title: "Salário",
    amount: 3000.0,
    date: "2024-05-01",
    category: "income",
  },
  {
    id: "3",
    title: "Conta de Luz",
    amount: -120.75,
    date: "2024-05-10",
    category: "utilities",
  },
  {
    id: "4",
    title: "Cinema",
    amount: -45.0,
    date: "2024-05-12",
    category: "entertainment",
  },
  {
    id: "5",
    title: "Aluguel",
    amount: -850.0,
    date: "2024-05-01",
    category: "housing",
  },
  {
    id: "6",
    title: "Uber",
    amount: -25.5,
    date: "2024-05-14",
    category: "transport",
  },
  {
    id: "7",
    title: "Farmácia",
    amount: -75.3,
    date: "2024-05-08",
    category: "health",
  },
  {
    id: "8",
    title: "Curso de React",
    amount: -199.9,
    date: "2024-05-03",
    category: "education",
  },
  {
    id: "9",
    title: "Presente Aniversário",
    amount: -89.99,
    date: "2024-05-13",
    category: "others",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const currentBalance = mockTransactions.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: "/" });
      router.replace("../");
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentMonth = () => {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const now = new Date();
    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  };

  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => <ExpenseCard transaction={item} />,
    []
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  // Performance optimization: Calculate item layout if ExpenseCard has consistent height
  const getItemLayout = (
    data: ArrayLike<Transaction> | null | undefined,
    index: number
  ) => ({
    length: 80, // 16px top padding + 16px bottom padding + 12px marginBottom + ~36px content height
    offset: 80 * index,
    index,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with avatar and user name */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>DV</Text>
            </View>
            <Text style={styles.userName}>Danilo Vilhena</Text>
          </View>
          <TouchableOpacity onPress={handleSignOut}>
            <Feather name="log-out" size={18} color={"#fff"} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <Text style={styles.totalLabel}>TOTAL GASTO</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.dark.textSecondary}
            />
          </View>
          <View style={styles.balanceBottom}>
            <Text style={styles.balanceAmount}>
              {formatCurrency(currentBalance)}
            </Text>
            <View style={styles.monthTag}>
              <Text style={styles.monthTagText}>{getCurrentMonth()}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <FlatList
            data={mockTransactions}
            renderItem={renderTransaction}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            // Performance optimizations
            getItemLayout={getItemLayout}
            windowSize={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={15}
            removeClippedSubviews={true}
            // Enable faster scrolling
            scrollEventThrottle={16}
            // Optimize for large lists
            legacyImplementation={false}
          />
        </View>
      </View>

      <Pressable style={styles.fab}>
        <Feather name="plus" size={28} color={colors.dark.primary} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontFamily: "DMSans",
    fontWeight: "700",
    fontSize: 14,
    color: colors.dark.primary,
  },
  userName: {
    fontFamily: "DMSans",
    fontWeight: "600",
    fontSize: 18,
    color: colors.dark.textPrimary,
  },
  balanceCard: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: "DMSans",
    fontWeight: "600",
    fontSize: 12,
    color: colors.dark.textSecondary,
    letterSpacing: 0.5,
  },
  balanceBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  balanceAmount: {
    fontFamily: "DMSans",
    fontWeight: "800",
    fontSize: 28,
    color: colors.dark.textPrimary,
  },
  monthTag: {
    backgroundColor: colors.yellow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  monthTagText: {
    fontFamily: "DMSans",
    fontWeight: "500",
    fontSize: 12,
    color: colors.dark.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginBottom: 20,
  },
  transactionsContainer: {
    flex: 1,
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 30,
    backgroundColor: colors.yellow,
    color: colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
});
