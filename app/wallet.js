import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Wallet() {
  const router = useRouter();

  const [balance, setBalance] = useState(15200.75);
  const [transactions, setTransactions] = useState([
    { id: 2, type: "No Orders Yet" },
  
  ]);

  const addFunds = () => {
    setBalance(balance + 1000);
    setTransactions([
      { id: Date.now(), type: "Sale - Chicken Breast (Demo)", amount: 1000, date: "Oct 17, 2025" },
      ...transactions,
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 My Orders</Text>

      <Text style={styles.subtitle}>Order History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.transaction, item.amount < 0 && styles.negative]}>
            <Text style={styles.txType}>{item.type}</Text>
            <Text style={styles.txDate}>{item.date}</Text>
            <Text style={styles.txAmount}>
              {item.amount < 0 ? "-" : "+"}₱{Math.abs(item.amount).toFixed(2)}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2E7D32", marginBottom: 10 },
  balanceLabel: { fontSize: 16, color: "#555" },
  balance: { fontSize: 36, fontWeight: "bold", marginBottom: 15, color: "#4CAF50" },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: "#ccc",
  },
  txType: { fontWeight: "bold" },
  txDate: { color: "#888" },
  txAmount: { fontWeight: "bold", color: "#2E7D32" },
  negative: { borderColor: "#E53935" },
  backText: { marginTop: 20, color: "#4CAF50", textAlign: "center" },
});
