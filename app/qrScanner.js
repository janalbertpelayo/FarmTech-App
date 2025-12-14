import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QrScanner() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("");

  // Simulate scanning for demo purposes
  const handleScan = () => {
    // In a real app, integrate expo-barcode-scanner or similar here
    const fakeData = "MERCHANT123456";
    setData(fakeData);
    setScanned(true);
    Alert.alert("QR Scanned", `Scanned Data: ${fakeData}`);
  };

  const handleReturn = () => {
    router.push({
      pathname: params.returnTo || "/ewalletPayment",
      params: {
        scanned: data,
        accountName: params.accountName,
        accountNumber: params.accountNumber,
        cart: params.cart,
        total: params.total,
        address: params.address,
        paymentMethod: params.paymentMethod,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Merchant QR</Text>
      <View style={styles.qrBox}>
        <Text style={styles.qrText}>
          {scanned ? `Scanned: ${data}` : "No QR scanned yet."}
        </Text>
      </View>
      <TouchableOpacity style={styles.scanBtn} onPress={handleScan} disabled={scanned}>
        <Text style={styles.scanBtnText}>{scanned ? "Scanned" : "Simulate Scan"}</Text>
      </TouchableOpacity>
      {scanned && (
        <TouchableOpacity style={styles.returnBtn} onPress={handleReturn}>
          <Text style={styles.returnBtnText}>Return to Payment</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1B5E20", marginBottom: 24, textAlign: "center" },
  qrBox: {
    borderWidth: 2,
    borderColor: "#1976D2",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#E3F2FD",
  },
  qrText: { fontSize: 16, color: "#333" },
  scanBtn: {
    backgroundColor: "#1976D2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  scanBtnText: { color: "#fff", fontWeight: "bold" },
  returnBtn: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  returnBtnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: {
    backgroundColor: "#B71C1C",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  cancelBtnText: { color: "#fff", fontWeight: "bold" },
});