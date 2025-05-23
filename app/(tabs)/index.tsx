import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
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
    title: "Supermercado",
    amount: -150.5,
    date: "2024-05-15",
    category: "Alimentação",
  },
  {
    id: "2",
    title: "Salário",
    amount: 3000.0,
    date: "2024-05-01",
    category: "Renda",
  },
  {
    id: "3",
    title: "Conta de Luz",
    amount: -120.75,
    date: "2024-05-10",
    category: "Moradia",
  },
  {
    id: "4",
    title: "Cinema",
    amount: -45.0,
    date: "2024-05-12",
    category: "Lazer",
  },
];

export default function HomeScreen() {
  const currentBalance = mockTransactions.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const totalSpent = mockTransactions
    .filter((t) => t.amount < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.amount > 0 ? "#4CAF50" : "#F44336" },
        ]}
      >
        {item.amount > 0 ? "+" : ""}R$ {Math.abs(item.amount).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.monthTagContainer}>
            <View style={styles.monthTag}>
              <Text style={styles.monthTagText}>Maio 2024</Text>
            </View>
          </View>
          <Text style={styles.balanceAmount}>R$ {totalSpent.toFixed(2)}</Text>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Últimas transações</Text>
          <FlatList
            data={mockTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <Pressable style={styles.fab}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  monthTagContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  monthTag: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  monthTagText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: colors.textColor,
  },
  balanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
  },
  balanceAmount: {
    fontFamily: "DMSans_700Bold",
    fontSize: 32,
    color: colors.textColor,
    textAlign: "center",
  },
  transactionsContainer: {
    flex: 1,
  },
  transactionsTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    color: colors.textColor,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: "DMSans_500Medium",
    fontSize: 16,
    color: colors.textColor,
  },
  transactionCategory: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  transactionAmount: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.textColor,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
