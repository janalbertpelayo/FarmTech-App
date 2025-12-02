import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useProducts } from "../context/productcontext";

const users = [
  { uid: "user1", displayName: "Juan Dela Cruz" },
  { uid: "user2", displayName: "Maria Santos" },
  // Add more users as needed
];

export default function Marketplace() {
  const router = useRouter();
  const { products } = useProducts();
  const [menuVisible, setMenuVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartQuantity, setCartQuantity] = useState("");
  const [cartUnit, setCartUnit] = useState("");

  const menuItems = [
    { title: "🛍️ My Products", route: "/products" },
    { title: " +  Post Products", route: "/postproduct" },
    { title: "🛒 My Cart", route: "/postproduct" },
    { title: "🚚 Logistics", route: "/logistics" },
    { title: "💰 Wallet", route: "/wallet" },
    { title: "💬 Community", route: "/community" },
    { title: "👤 Profile", route: "/profile" },
  ];

  const categories = [
    { key: "Crop", label: "🌾 Crops" },
    { key: "Meat", label: "🍖 Meat" },
    { key: "Livestock", label: "🐄 Livestock" },
  ];

  const unitOptions = ["kg", "gram", "sack", "bundle", "head", "piece", "tray", "crate", "bunch", "liter"]; // Example unit options

  // Filter products by category and search
  const filteredProducts = products.filter(
    (item) =>
      (!selectedCategory || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.category === "Livestock" &&
          (
            (item.breed && item.breed.toLowerCase().includes(search.toLowerCase())) ||
            (item.age && item.age.toLowerCase().includes(search.toLowerCase())) ||
            (item.gender && item.gender.toLowerCase().includes(search.toLowerCase()))
          )
        )
      )
  );

  const handleAddToCart = () => {
    if (selectedProduct && cartQuantity && cartUnit) {
      addToCart(selectedProduct, cartQuantity, cartUnit);
      setCartModalVisible(false);
      setCartQuantity("");
      setCartUnit("");
    }
  };

  function getOwnerName(userId) {
    // Example: lookup from users state or fetch from DB
    const user = users.find(u => u.uid === userId);
    return user ? user.displayName : "Unknown";
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>🛒 Marketplace</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.cartBtn} onPress={() => router.push("/cart")}> 
              <Text style={styles.cartBtnText}>🛒</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
              <Text style={styles.menuBtnText}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Category Selection or Product List */}
        {!selectedCategory ? (
          <View style={styles.categoryColumn}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={styles.categoryBtn}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text style={styles.categoryBtnText}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            <View style={styles.categoryHeader}>
              <Text style={styles.selectedCategoryText}>
                {categories.find((c) => c.key === selectedCategory)?.label}
              </Text>
            </View>
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text style={styles.empty}>No products found.</Text>}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image source={item.image_url} style={styles.image} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.quantity}>Qty: {item.quantity}</Text>
                    <Text>{item.price}</Text>
                    <Text style={styles.categoryTag}>
                      {item.category === "Meat"
                        ? "🍖 Meat"
                        : item.category === "Livestock"
                        ? "🐄 Livestock"
                        : "🌾 Crop"}
                    </Text>
                    {item.category === "Livestock" && (
                      <>
                        <Text style={styles.livestockInfo}>Breed: {item.breed}</Text>
                        <Text style={styles.livestockInfo}>Age: {item.age}</Text>
                        <Text style={styles.livestockInfo}>Gender: {item.gender}</Text>
                      </>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.cartIcon}
                    onPress={() => {
                      setSelectedProduct(item);
                      setCartModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="add-shopping-cart" size={28} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}

        {/* Menu Modal */}
        <Modal
          visible={menuVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setMenuVisible(false)}
        >
          <View style={styles.menuOverlay}>
            <View style={styles.menuModal}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.title}
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    router.push(item.route);
                  }}
                >
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.cartCancelBtn}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.cartCancelText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Cart Modal */}
        <Modal
          visible={cartModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCartModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.cartModal}>
              {selectedProduct && (
                <>
                  <Image
                    source={ selectedProduct.image_url }
                    style={styles.cartImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.cartPrice}>
                    {selectedProduct.price}  {selectedProduct.price_unit}
                  </Text>
                  <Text style={styles.cartAvailable}>
                    Available: {selectedProduct.quantity} {selectedProduct.quantity_unit}
                  </Text>
                  <Text style={styles.cartOwner}>
                    Seller: {getOwnerName(selectedProduct.user_id)}
                  </Text>

                  {/* User Inputs */}
                  <View style={{ flexDirection: "row", width: "100%", marginBottom: 8 }}>
                    <TextInput
                      style={[styles.cartInput, { flex: 2, marginRight: 8, marginBottom: 0 }]}
                      placeholder="Quantity"
                      keyboardType="numeric"
                      value={cartQuantity}
                      onChangeText={setCartQuantity}
                    />
                    <Picker
                      selectedValue={cartUnit}
                      onValueChange={setCartUnit}
                      style={[styles.cartPicker, { flex: 1 }]}
                    >
                      {unitOptions.map((unit) => (
                        <Picker.Item key={unit} label={unit} value={unit} />
                      ))}
                    </Picker>
                  </View>

                  <TouchableOpacity
                    style={styles.cartAddBtn}
                    onPress={handleAddToCart}
                  >
                    <Text style={styles.cartAddText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cartCancelBtn}
                    onPress={() => setCartModalVisible(false)}
                  >
                    <Text style={styles.cartCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
      {/* Bottom Back Button */}
      {selectedCategory && (
        <TouchableOpacity
          style={styles.backBottomBtn}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  cartBtn: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#82f14e67',
    borderRadius: 8,
  },
  cartBtnText: {
    fontSize: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#2E7D32" },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  postBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  menuBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  menuBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  categoryColumn: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 20,
    marginTop: 10,
  },
  categoryBtn: {
    backgroundColor: "#e8f5e9",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 7,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  categoryBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388e3c",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedCategoryText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10, fit: "cover" },
  name: { fontWeight: "bold", fontSize: 16 },
  quantity: { fontSize: 14, color: "#333", marginTop: 2 },
  categoryTag: { marginTop: 4, fontSize: 13, color: "#4CAF50" },
  livestockInfo: { fontSize: 13, color: "#795548" },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 30,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menuItemText: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "bold",
  },
  backBottomBtn: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
    margin: 20,
    marginBottom: 30,
  },
  backText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
  },
  cartIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 2,
  },
  cartModal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  cartImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    backgroundColor: "#388e3c",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    objectFit: 'cover',
  },
  cartPrice: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cartAvailable: { fontSize: 16, marginBottom: 4 },
  cartOwner: { fontSize: 15, color: '#555', marginBottom: 10 },
  cartInput: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8 },
  cartPicker: { width: '100%', height: 66, marginBottom: 8 },
  cartAddBtn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 6, marginTop: 8, width: '100%', alignItems: 'center' },
  cartAddText: { color: '#fff', fontWeight: 'bold' },
  cartCancelBtn: { marginTop: 8, width: '100%', alignItems: 'center' },
  cartCancelText: { color: '#4CAF50', fontWeight: 'bold' },
});