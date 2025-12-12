import { useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Dashboard() {
  const router = useRouter();

  const menu = [
    { title: "🛒 Marketplace", route: "/marketplace", color: "#4CAF50" }, 
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to return to the Welcome screen?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => router.replace("/welcome"),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌾 FarmTech 🌾</Text>
      <Text style={styles.subtitle}>Connecting Farmers to Markets</Text>

      {menu.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, { backgroundColor: item.color }]}
          onPress={() => router.push(item.route)}
        >
          <Text style={styles.buttonText}>{item.title}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 5, color: "#2E7D32" },
  subtitle: { fontSize: 16, marginBottom: 25, color: "#555" },
  button: {
    width: "90%",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  logoutBtn: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  logoutText: { color: "#E53935", fontWeight: "bold", fontSize: 16 },
});
