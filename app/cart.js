import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Cart() {
  const router = useRouter();
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [address, setAddress] = useState("Lapasan, Cagayan de Oro City");

  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" | "GCASH" | "MAYA"

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Tomatoes", quantity: 1, price: 150 },
    { id: 2, name: "Drum Stick", quantity: 1, price: 200 },
    { id: 3, name: "Goat", quantity: 1, price: 3500 },
  ]);

  const [editId, setEditId] = useState(null);
  const [editQty, setEditQty] = useState(1);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // E-Wallet required fields
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleConfirm = () => {
    if (!address.trim()) {
      Alert.alert("Address required", "Please enter a delivery address.");
      return;
    }

    if (paymentMethod === "GCASH" || paymentMethod === "MAYA") {
      // Validate required info
      if (!accountName.trim() || !accountNumber.trim()) {
        Alert.alert("Required", "Please fill in your E-Wallet info.");
        return;
      }
      // Navigate to E-Wallet Payment screen
      router.push({
        pathname: "/ewalletPayment",
        params: {
          cart: JSON.stringify(cartItems),
          total: total.toString(),
          address,
          paymentMethod,
          accountName,
          accountNumber,
        },
      });
      setCheckoutVisible(false);
      return;
    }

    // COD flow
    router.push({
      pathname: "/logistics",
      params: { address },
    });
    setCartItems([]);
    setCheckoutVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 My Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>Your cart is empty.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              {editId === item.id ? (
                <View style={styles.editRow}>
                  <Text style={styles.quantity}>Qty:</Text>
                  <TextInput
                    style={styles.editInput}
                    keyboardType="numeric"
                    value={editQty.toString()}
                    onChangeText={(text) =>
                      setEditQty(text.replace(/[^0-9]/g, ""))
                    }
                  />
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => {
                      setCartItems(
                        cartItems.map((ci) =>
                          ci.id === item.id
                            ? { ...ci, quantity: Number(editQty) }
                            : ci
                        )
                      );
                      setEditId(null);
                    }}
                  >
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditId(null)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.quantity}>Qty: {item.quantity}</Text>
              )}
              <Text style={styles.price}>₱{item.price}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setEditId(item.id);
                  setEditQty(item.quantity);
                }}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  setCartItems(cartItems.filter((ci) => ci.id !== item.id))
                }
              >
                <Text style={styles.deleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {cartItems.length > 0 && (
        <>
          <Text style={styles.total}>Total: ₱{total.toFixed(2)}</Text>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => setCheckoutVisible(true)}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Checkout Modal */}
      <Modal
        visible={checkoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCheckoutVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalOverlay}>
          <View style={styles.checkoutModal}>
            <Text style={styles.modalTitle}>Checkout</Text>
            <Text style={styles.modalTotal}>Total: ₱{total.toFixed(2)}</Text>

            {/* Payment Selector (Button style) */}
            <View style={styles.paymentButtons}>
              {["COD", "GCASH", "MAYA"].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentBtn,
                    paymentMethod === method && styles.paymentBtnActive,
                  ]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text style={styles.paymentBtnText}>
                    {method === "COD" ? "Cash on Delivery" : method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* E-Wallet Fields */}
            {(paymentMethod === "GCASH" || paymentMethod === "MAYA") && (
              <View style={{ width: "100%", marginTop: 12 }}>
                <Text style={styles.label}>Account Name (required)</Text>
                <TextInput
                  style={styles.input}
                  value={accountName}
                  onChangeText={setAccountName}
                  placeholder="Enter account name"
                />
                <Text style={styles.label}>Account Number / Mobile (required)</Text>
                <TextInput
                  style={styles.input}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="Enter account number"
                  keyboardType="phone-pad"
                />
              </View>
            )}

            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              placeholder="Delivery Address"
              value={address}
              onChangeText={setAddress}
            />

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>
                {paymentMethod === "COD"
                  ? "Confirm (COD)"
                  : "Continue to E-Wallet"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setCheckoutVisible(false)}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7fdf9" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10, color: "#1B5E20" },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: "#000", elevation: 2 },
  name: { fontSize: 17, fontWeight: "bold" },
  quantity: { fontSize: 14, marginTop: 3, color: "#555" },
  price: { fontSize: 16, color: "#2E7D32", marginTop: 4 },
  editRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  editInput: { borderWidth: 1, borderColor: "#ccc", width: 45, height: 32, marginHorizontal: 6, textAlign: "center", borderRadius: 6 },
  actions: { justifyContent: "center", marginLeft: 10 },
  editBtn: { backgroundColor: "#2196F3", padding: 7, borderRadius: 6, marginBottom: 6 },
  editText: { color: "#fff", fontWeight: "bold" },
  deleteBtn: { backgroundColor: "#E53935", padding: 7, borderRadius: 6 },
  deleteText: { color: "#fff", fontWeight: "bold" },
  total: { fontSize: 20, fontWeight: "bold", marginTop: 10, color: "#1B5E20" },
  checkoutBtn: { backgroundColor: "#43A047", padding: 15, borderRadius: 10, marginTop: 10, alignItems: "center" },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  backBtn: { backgroundColor: "#ddd", padding: 15, borderRadius: 10, marginTop: 10, alignItems: "center" },
  backText: { fontWeight: "bold", color: "#1B5E20" },
  modalOverlay: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)", paddingVertical: 20 },
  checkoutModal: { backgroundColor: "#fff", width: "90%", borderRadius: 14, padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#1B5E20", textAlign: "center" },
  modalTotal: { fontSize: 18, marginBottom: 12, textAlign: "center" },
  paymentButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  paymentBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", marginRight: 8, alignItems: "center" },
  paymentBtnActive: { backgroundColor: "#E8F5E9", borderColor: "#4CAF50" },
  paymentBtnText: { fontWeight: "600" },
  label: { fontWeight: "600", marginTop: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginTop: 6 },
  confirmBtn: { backgroundColor: "#2E7D32", padding: 14, borderRadius: 10, marginTop: 15, alignItems: "center" },
  confirmText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  closeBtn: { marginTop: 12, alignItems: "center" },
  closeText: { color: "#2E7D32", fontWeight: "bold" },
  saveBtn: { backgroundColor: "#4CAF50", padding: 6, borderRadius: 4, marginRight: 4 },
  saveText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: { backgroundColor: "#eee", padding: 6, borderRadius: 4 },
  cancelText: { color: "#333", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
});
