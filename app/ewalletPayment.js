// app/ewalletPayment.js
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EwalletPayment() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // parse data from Cart.js
  const cart = params.cart ? JSON.parse(params.cart) : [];
  const total = params.total ? Number(params.total) : 0;
  const address = params.address ?? "";
  const paymentMethod = params.paymentMethod ?? "GCASH";
  const initialAccountName = params.accountName ?? "";
  const initialAccountNumber = params.accountNumber ?? "";

  const [accountName, setAccountName] = useState(initialAccountName);
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [reference, setReference] = useState("");
  const [scannedData, setScannedData] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // handle returned scanned QR data
  useEffect(() => {
    if (params.scanned) {
      setScannedData(params.scanned);
      // Do NOT reset accountName/accountNumber here
    }
  }, [params.scanned]);

  const handleScan = () => {
    router.push({
      pathname: "/qrScanner",
      params: {
        returnTo: "/ewalletPayment",
        accountName,
        accountNumber,
        cart: params.cart,
        total: params.total,
        address: params.address,
        paymentMethod: params.paymentMethod,
      },
    });
  };

  const handlePay = () => {
    if (!accountName.trim() || !accountNumber.trim()) {
      Alert.alert("Required", "Please fill in all required fields.");
      return;
    }
    if (!scannedData) {
      Alert.alert("Scan QR", "Please scan the merchant QR first.");
      return;
    }
    setPaymentComplete(true);
  };

  const handleContinue = () => {
    // Navigate to the marketplace screen after payment
    router.push("/marketplace");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>E-Wallet Payment ({paymentMethod})</Text>

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

      <Text style={styles.label}>Reference / Note (optional)</Text>
      <TextInput
        style={styles.input}
        value={reference}
        onChangeText={setReference}
        placeholder="e.g. Order #1234"
      />

      <View style={{ marginTop: 12 }}>
        <Text style={styles.smallLabel}>Total Amount</Text>
        <Text style={styles.total}>₱{total.toFixed(2)}</Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text style={styles.smallLabel}>Scanned QR Data</Text>
        <Text style={styles.scannedText}>
          {scannedData ?? "No QR scanned yet."}
        </Text>
      </View>

      <TouchableOpacity style={styles.scanBtn} onPress={handleScan}>
        <Text style={styles.scanBtnText}>Scan QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
        <Text style={styles.payBtnText}>Pay with {paymentMethod}</Text>
      </TouchableOpacity>

      {paymentComplete && (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>Payment Successful ✅</Text>
          <Text style={styles.successText}>Provider: {paymentMethod}</Text>
          <Text style={styles.successText}>Account: {accountName}</Text>
          <Text style={styles.successText}>Number: {accountNumber}</Text>
          <Text style={styles.successText}>Amount: ₱{total.toFixed(2)}</Text>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", minHeight: "100%" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1B5E20", marginBottom: 14 },
  label: { fontWeight: "600", marginTop: 8 },
  smallLabel: { fontWeight: "600", marginTop: 6 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginTop: 6 },
  total: { fontSize: 20, fontWeight: "bold", color: "#2E7D32" },
  scannedText: { marginTop: 6, color: "#333" },
  scanBtn: { backgroundColor: "#1976D2", padding: 12, borderRadius: 8, marginTop: 12, alignItems: "center" },
  scanBtnText: { color: "#fff", fontWeight: "bold" },
  payBtn: { backgroundColor: "#2E7D32", padding: 14, borderRadius: 8, marginTop: 12, alignItems: "center" },
  payBtnText: { color: "#fff", fontWeight: "bold" },
  successBox: { marginTop: 18, padding: 14, backgroundColor: "#E8F5E9", borderRadius: 8 },
  successTitle: { fontWeight: "bold", color: "#1B5E20", marginBottom: 6 },
  successText: { color: "#1B5E20" },
  continueBtn: { marginTop: 12, backgroundColor: "#4CAF50", padding: 10, borderRadius: 8, alignItems: "center" },
  continueText: { color: "#fff", fontWeight: "bold" },
});
