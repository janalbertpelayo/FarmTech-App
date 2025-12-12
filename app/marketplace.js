import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useProducts } from "../context/productcontext";

const users = [
  { uid: "user1", displayName: "Juan Dela Cruz (Seller)" },
  { uid: "user2", displayName: "Loranz Almonia" },
];

export default function Marketplace() {
  const router = useRouter();
  const { products = [], addToCart } = useProducts() || {};

  // UI States
  const [menuVisible, setMenuVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Cart modal states
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartQuantity, setCartQuantity] = useState("");
  const [cartUnit, setCartUnit] = useState("");

  // Success "added to cart" message
  const [addedMessage, setAddedMessage] = useState("");

  const menuItems = [
    { title: "🚚 Orders", route: "/logistics" },
    { title: "📋 Order History", route: "/wallet" },
    { title: "💬 Contact Seller", route: "/community" },
    { title: "👤 Profile", route: "/profile" },
  ];

  const categories = [
    { key: "Crop", label: "🌾 Crops" },
    { key: "Meat", label: "🍖 Meat" },
    { key: "Livestock", label: "🐄 Livestock" },
  ];

  const unitOptions = ["kg", "quantity"];

  // helper to support image source either as uri string or local require
  const getImageSource = (image) => {
    if (!image) return null;
    if (typeof image === "string") return { uri: image };
    return image; // assume require(...) result
  };

  // Filter products
  const filteredProducts = (products || []).filter((item) => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const searchText = (search || "").toLowerCase();
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchText) ||
      (item.category === "Livestock" &&
        (
          (item.breed && item.breed.toLowerCase().includes(searchText)) ||
          (item.age && item.age.toLowerCase().includes(searchText)) ||
          (item.gender && item.gender.toLowerCase().includes(searchText))
        ));
    return matchesCategory && matchesSearch;
  });

  function getOwnerName(userId) {
    const user = users.find((u) => u.uid === userId);
    return user ? user.displayName : "Juan";
  }

  // Robust add-to-cart handler
  const handleAddToCart = () => {
    if (!selectedProduct) {
      console.warn("No product selected");
      return;
    }

    const qtyNumber = Number(cartQuantity);
    if (!cartQuantity || Number.isNaN(qtyNumber) || qtyNumber <= 0) {
      console.warn("Invalid quantity:", cartQuantity);
      return;
    }
    if (!cartUnit) {
      console.warn("No unit selected");
      return;
    }

    try {
      if (typeof addToCart === "function") {
        addToCart(selectedProduct, qtyNumber, cartUnit);
      } else {
        console.warn("addToCart is not provided by context. Skipping actual add.");
      }
    } catch (err) {
      console.error("Error calling addToCart:", err);
    }

    setCartModalVisible(false);
    setCartQuantity("");
    setCartUnit("");

    setAddedMessage("Added to cart!");
    setTimeout(() => setAddedMessage(""), 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
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

        {/* Search */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Category List */}
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
            <Text style={styles.selectedCategoryText}>
              {categories.find((c) => c.key === selectedCategory)?.label}
            </Text>

            {/* Product List */}
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => (item.id !== undefined ? item.id.toString() : Math.random().toString())}
              contentContainerStyle={{ paddingBottom: 120 }} // prevent overlap with bottom button
              ListEmptyComponent={<Text style={styles.empty}>No products found.</Text>}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image source={getImageSource(item.image_url)} style={styles.image} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text>Qty: {item.quantity}</Text>
                    <Text>₱{item.price}</Text>
                    <Text style={styles.categoryTag}>{item.category}</Text>
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

        {/* Back to Categories */}
        {selectedCategory && (
          <TouchableOpacity
            style={styles.backBottomBtn}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}

        {/* Floating "Added to Cart" message */}
        {addedMessage !== "" && (
          <View style={styles.addedMessageContainer}>
            <Text style={styles.addedMessageText}>{addedMessage}</Text>
          </View>
        )}

        {/* Menu Modal */}
        <Modal visible={menuVisible} transparent animationType="slide">
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
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={styles.cartCancelText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add to Cart Modal */}
        <Modal visible={cartModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.cartModal}>
              {selectedProduct && (
                <>
                  <Image source={getImageSource(selectedProduct.image_url)} style={styles.cartImage} />

                  <Text style={styles.cartPrice}>₱{selectedProduct.price}</Text>
                  <Text>Available: {selectedProduct.quantity}</Text>
                  <Text>Seller: {getOwnerName(selectedProduct.user_id)}</Text>

                  {/* Inputs */}
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <TextInput
                      style={[styles.cartInput, { flex: 2, marginRight: 10 }]}
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
                      <Picker.Item label="Unit" value="" />
                      {unitOptions.map((u) => (
                        <Picker.Item key={u} label={u} value={u} />
                      ))}
                    </Picker>
                  </View>

                  <TouchableOpacity style={styles.cartAddBtn} onPress={handleAddToCart}>
                    <Text style={styles.cartAddText}>Add to Cart</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                    <Text style={styles.cartCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#2E7D32" },

  headerActions: { flexDirection: "row" },
  cartBtn: { padding: 10, backgroundColor: "#d0f5c6", borderRadius: 10, marginRight: 10 },
  cartBtnText: { fontSize: 20 },
  menuBtn: { padding: 10, backgroundColor: "#4CAF50", borderRadius: 10 },
  menuBtnText: { fontSize: 18, color: "#fff" },

  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },

  categoryColumn: { marginTop: 10 },
  categoryBtn: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#4CAF50",
    padding: 18,
    borderRadius: 10,
    marginVertical: 6,
  },
  categoryBtnText: { fontSize: 18, fontWeight: "bold", color: "#2E7D32" },

  selectedCategoryText: { fontSize: 20, fontWeight: "bold", color: "#2E7D32", marginBottom: 10 },

  card: {
    flexDirection: "row",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "bold" },

  categoryTag: { fontSize: 13, color: "#4CAF50" },

  cartIcon: { padding: 6 },

  backBottomBtn: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  backText: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
  },

  empty: { textAlign: "center", marginTop: 20, color: "#888" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cartModal: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cartImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10 },
  cartPrice: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },

  cartInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  cartPicker: { borderWidth: 1, borderRadius: 8 },

  cartAddBtn: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    padding: 12,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
  },
  cartAddText: { color: "#fff", fontWeight: "bold" },
  cartCancelText: { marginTop: 10, color: "#4CAF50", fontSize: 16 },

  menuOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menuModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: { paddingVertical: 15 },
  menuItemText: { fontSize: 18, color: "#2E7D32", fontWeight: "bold" },

  // Floating success message
  addedMessageContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  addedMessageText: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: "bold",
    elevation: 5,
  },
});
