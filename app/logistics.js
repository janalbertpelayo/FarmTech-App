import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Logistics() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [deliveries, setDeliveries] = useState([
    { 
      id: 1, 
      product: "Tomatoes (1kg)", 
      status: "📦 In Transit", 
      location: "Warehouse A", 
      eta: "Dec. 9-12, 2025",
      orderDetails: {
        customerName: "Lorenz Almonia",
        productName: "Fresh Tomatoes",
        price: 150.00,
        quantity: 1,
        unit: "kg",
        total: 150.00,
        orderDate: "2024-12-06",
        deliveryAddress: "Lapasan, Cagayan de Oro City",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending"
      }
    },
    { 
      id: 2, 
      product: "Drum Stick (1kg)", 
      status: "📦 In Transit", 
      location: "Warehouse A", 
      eta: "Dec. 9-12, 2025",
      orderDetails: {
        customerName: "Lorenz Almonia",
        productName: "Drum Stick",
        price: 200.00,
        quantity: 1,
        unit: "kg",
        total: 200.00,
        orderDate: "2024-12-06",
        deliveryAddress: "Lapasan, Cagayan de Oro City",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending"
      }
    },
    { 
      id: 3, 
      product: "Goat (1qty)", 
      status: "📦 In Transit", 
      location: "Warehouse A", 
      eta: "Dec. 9-12, 2025",
      orderDetails: {
        customerName: "Lorenz Almonia",
        productName: "Goat",
        price: 3500.00,
        quantity: 1,
        unit: "qty",
        total: 1050.00,
        orderDate: "2024-12-06",
        deliveryAddress: "Lapasan, Cagayan de Oro City",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending"
      }
    },
  ]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚚 Orders</Text>
      <Text style={styles.subtitle}>Track your product movement</Text>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.product}</Text>
            <Text style={styles.detailText}><Text style={styles.label}>Status:</Text> {item.status}</Text>
            <Text style={styles.detailText}><Text style={styles.label}>Location:</Text> {item.location}</Text>
            <Text style={styles.detailText}><Text style={styles.label}>ETA:</Text> {item.eta}</Text>

            <TouchableOpacity 
              style={styles.viewBtn} 
              onPress={() => handleViewOrder(item)}
            >
              <Text style={styles.viewText}>View Order Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>

      {/* Order Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>📄 Order Details</Text>
            
            {selectedOrder && (
              <ScrollView style={styles.modalContent}>
                {/* Customer Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Customer Information</Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Name: </Text>
                    {selectedOrder.orderDetails.customerName}
                  </Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Delivery Address: </Text>
                    {selectedOrder.orderDetails.deliveryAddress}
                  </Text>
                </View>

                {/* Order Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Order Information</Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Order Date: </Text>
                    {selectedOrder.orderDetails.orderDate}
                  </Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Product: </Text>
                    {selectedOrder.orderDetails.productName}
                  </Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Quantity: </Text>
                    {selectedOrder.orderDetails.quantity} {selectedOrder.orderDetails.unit}
                  </Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Unit Price: </Text>
                    ₱{selectedOrder.orderDetails.price.toFixed(2)}
                  </Text>
                </View>

                {/* Payment Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Payment Information</Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Payment Method: </Text>
                    {selectedOrder.orderDetails.paymentMethod}
                  </Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Payment Status: </Text>
                    <Text style={[
                      styles.statusText,
                      selectedOrder.orderDetails.paymentStatus === 'Paid' ? styles.paid : styles.pending
                    ]}>
                      {selectedOrder.orderDetails.paymentStatus}
                    </Text>
                  </Text>
                </View>

                {/* Total Amount */}
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                  <Text style={styles.totalAmount}>₱{selectedOrder.orderDetails.total.toFixed(2)}</Text>
                </View>

                {/* Delivery Status */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Delivery Status</Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Current Status: </Text>
                    {selectedOrder.status}
                  </Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Location: </Text>
                    {selectedOrder.location}
                  </Text>
                  <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Estimated Arrival: </Text>
                    {selectedOrder.eta}
                  </Text>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#2E7D32",
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 15, 
    marginBottom: 20, 
    color: "#555" 
  },
  card: { 
    borderWidth: 1, 
    borderColor: "#E0E0E0",
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: { 
    fontWeight: "bold", 
    fontSize: 18, 
    marginBottom: 8,
    color: "#2E7D32" 
  },
  detailText: { 
    fontSize: 14, 
    marginBottom: 4,
    color: "#555" 
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  viewBtn: {
    backgroundColor: "#0c841aff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  viewText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16 
  },
  backText: { 
    marginTop: 15, 
    color: "#4CAF50", 
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500"
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "95%",
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },
  modalContent: {
    maxHeight: "80%",
    marginBottom: 15,
  },
  detailSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  detailLabel: {
    fontWeight: "600",
    color: "#333",
  },
  statusText: {
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  paid: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  pending: {
    backgroundColor: "#FFF3E0",
    color: "#FF9800",
  },
  totalContainer: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  closeBtn: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    marginTop: 10,
  },
  closeText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
});