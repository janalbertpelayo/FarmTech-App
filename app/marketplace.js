import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View, TextInput, SafeAreaView } from "react-native";
import { useProducts } from "../context/productcontext";

export default function Marketplace() {
  const router = useRouter();
  const { products } = useProducts();
  const [menuVisible, setMenuVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const menuItems = [
    { title: "🛍️ My Products", route: "/products" },
    { title: " +  Post Products", route: "/postproduct" },
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>🛒 Marketplace</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.postBtn} onPress={() => router.push("/postproduct")}>
              <Text style={styles.postBtnText}>＋</Text>
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
                  <Image source={{ uri: item.image }} style={styles.image} />
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
                </View>
              )}
            />
          </>
        )}

        {/* Menu Modal */}
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
            <View style={styles.menuModal}>
              {menuItems.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    router.push(item.route);
                  }}
                >
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
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
  postBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  menuBtn: {
    backgroundColor: "#388e3c",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
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
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
  quantity: { fontSize: 14, color: "#333", marginTop: 2 },
  categoryTag: { marginTop: 4, fontSize: 13, color: "#4CAF50" },
  livestockInfo: { fontSize: 13, color: "#795548" },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
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
});