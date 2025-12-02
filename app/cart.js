import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Cart() {
  const router = useRouter();
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [address, setAddress] = useState("Blk 3 Lot 9 Emmanuel Homes Lumbia, CDOC");

  // 3 pre-added cart products
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Fresh Tomatoes", quantity: 2, price: 30 },
    { id: 2, name: "Organic Eggs", quantity: 1, price: 70 },
    { id: 3, name: "Sweet Mangoes", quantity: 3, price: 50 },
  ]);
  const [editId, setEditId] = useState(null);
  const [editQty, setEditQty] = useState(1);

  const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseFloat(item.quantity)), 0);

  const handleConfirm = () => {
    // Simulate order confirmation and navigation
    router.push({
      pathname: "/logistics",
      params: { address }
    });
    setCartItems([]);
    setCheckoutVisible(false);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 My Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              {editId === item.id ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.quantity}>Qty: </Text>
                  <TextInput
                    style={styles.editInput}
                    keyboardType="numeric"
                    value={editQty.toString()}
                    onChangeText={text => setEditQty(text.replace(/[^0-9]/g, ''))}
                  />
                  <TouchableOpacity style={styles.saveBtn} onPress={() => {
                    setCartItems(cartItems.map(ci => ci.id === item.id ? { ...ci, quantity: Number(editQty) } : ci));
                    setEditId(null);
                  }}>
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditId(null)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.quantity}>Qty: {item.quantity}</Text>
              )}
              <Text style={styles.price}>₱{item.price}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.editBtn} onPress={() => { setEditId(item.id); setEditQty(item.quantity); }}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => setCartItems(cartItems.filter(ci => ci.id !== item.id))}>
                <Text style={styles.deleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {cartItems.length > 0 && (
        <>
          <Text style={styles.total}>Total: ₱{total.toFixed(2)}</Text>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => setCheckoutVisible(true)}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Back Button at the bottom */}
      <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Checkout Modal */}
      <Modal
        visible={checkoutVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCheckoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.checkoutModal}>
            <Text style={styles.modalTitle}>Confirm Order</Text>
            <Text style={styles.modalTotal}>Total to pay: ₱{total.toFixed(2)}</Text>
            <Text style={styles.modalPayment}>Payment: Cash on Delivery</Text>
            <View style={{ width: "100%", marginBottom: 10 }}>
              {cartItems.map(item => (
                <View key={item.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                  <Text>Qty: {item.quantity}</Text>
                  <Text>₱{item.price}</Text>
                </View>
              ))}
            </View>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter delivery address"
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCheckoutVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#2E7D32" },
  card: { flexDirection: "row", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10, alignItems: "center" },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
  quantity: { fontSize: 14, color: "#333", marginTop: 2 },
  price: { fontSize: 16, color: "#4CAF50" },
  total: { fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10, color: "#2E7D32" },
  checkoutBtn: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 6, alignItems: "center", marginBottom: 10 },
  checkoutText: { color: "#fff", fontWeight: "bold" },
  backBtn: { backgroundColor: "#eee", padding: 15, borderRadius: 6, alignItems: "center" },
  backText: { color: "#2E7D32", fontWeight: "bold" },
  editBtn: { backgroundColor: '#2196F3', padding: 8, borderRadius: 4, marginRight: 6 },
  editText: { color: '#fff', fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#f44336', padding: 8, borderRadius: 4 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  editInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, width: 40, height: 30, textAlign: 'center', marginRight: 6 },
  saveBtn: { backgroundColor: '#4CAF50', padding: 6, borderRadius: 4, marginRight: 4 },
  saveText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#eee', padding: 6, borderRadius: 4 },
  cancelText: { color: '#333', fontWeight: 'bold' },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  checkoutModal: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalTotal: { fontSize: 18, marginBottom: 8 },
  modalPayment: { fontSize: 16, marginBottom: 8 },
  addressInput: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 12 },
  confirmBtn: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 6, marginTop: 8, width: '100%', alignItems: 'center' },
  confirmText: { color: "#fff", fontWeight: "bold" },
  closeBtn: { marginTop: 8, width: '100%', alignItems: 'center' },
  closeText: { color: "#4CAF50", fontWeight: "bold" },
});
