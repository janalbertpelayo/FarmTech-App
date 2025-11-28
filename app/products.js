// app/products.js
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useProducts } from "../context/productcontext";

export default function Products() {
  const router = useRouter();
  const { products, removeProduct } = useProducts();
  const [activeTab, setActiveTab] = useState("Crop");

  const filteredProducts = products.filter((p) => p.category === activeTab);

  const handleRemove = (id, name) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to remove "${name}" from your ${activeTab} list?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeProduct(id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🛍️ My Products</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.postBtn} onPress={() => router.push("/postproduct")}>
            <Text style={styles.postBtnText}>＋Post Product</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Crop" && styles.activeTab]}
          onPress={() => setActiveTab("Crop")}
        >
          <Text style={[styles.tabText, activeTab === "Crop" && styles.activeText]}>🌾 Crops</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Meat" && styles.activeTab]}
          onPress={() => setActiveTab("Meat")}
        >
          <Text style={[styles.tabText, activeTab === "Meat" && styles.activeText]}>🍖 Meat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Livestock" && styles.activeTab]}
          onPress={() => setActiveTab("Livestock")}
        >
          <Text style={[styles.tabText, activeTab === "Livestock" && styles.activeText]}>🐄 Livestock</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No {activeTab} products yet.</Text>}
        renderItem={({ item }) => (
          <View style={[
            styles.card,
            item.category === "Meat" && styles.meatCard,
            item.category === "Livestock" && styles.livestockCard
          ]}>
            <Image source={{ uri: item.image_url || "https://via.placeholder.com/100" }} style={styles.image} />
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
              {/* Show livestock info if applicable */}
              {item.category === "Livestock" && (
                <>
                  <Text style={styles.livestockInfo}>Breed: {item.breed}</Text>
                  <Text style={styles.livestockInfo}>Age: {item.age}</Text>
                  <Text style={styles.livestockInfo}>Gender: {item.gender}</Text>
                </>
              )}
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id, item.name)}>
              <Text style={styles.removeBtn}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.backBottomBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#2E7D32" },
  tabs: { flexDirection: "row", marginBottom: 15 },
  tab: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
  },
  activeTab: { borderColor: "#4CAF50" },
  tabText: { fontWeight: "bold", color: "#777" },
  activeText: { color: "#4CAF50" },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  meatCard: { borderColor: "#E53935" },
  livestockCard: { borderColor: "#8D6E63" },
  quantity: { fontSize: 14, color: "#333", marginTop: 2 },
  livestockInfo: { fontSize: 13, color: "#795548" },
  removeBtn: { fontSize: 20, color: "#E53935" },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
  backText: { marginTop: 15, color: "#4CAF50", textAlign: "center" },
  postBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 0,
  },
  postBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  backBottomBtn: {
    marginTop: 15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  backText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
  },
});

