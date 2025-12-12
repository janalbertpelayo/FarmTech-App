import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Community() {
  const router = useRouter();

  const [messages, setMessages] = useState([
    { id: 1, sender: "Seller Juan", text: "Hello! How can I help you today?" },
    { id: 2, sender: "You", text: "Hi, I’m interested in buying corn. Is it still available?" },
    { id: 3, sender: "Seller Juan", text: "Yes! I have fresh stock from yesterday’s harvest." },
    { id: 4, sender: "You", text: "Great! How much per kilo?" },
    { id: 5, sender: "Seller Juan", text: "₱35 per kilo." },
  ]);

  const [newText, setNewText] = useState("");

  const handleSend = () => {
    if (!newText.trim()) return;
    const msg = { id: Date.now(), sender: "You", text: newText };
    setMessages([...messages, msg]);
    setNewText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Chat with Seller</Text>

      {/* Chat List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "You" ? styles.myBubble : styles.theirBubble,
            ]}
          >
            <Text style={styles.sender}>
              {item.sender === "You" ? "You" : item.sender}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newText}
          onChangeText={setNewText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2E7D32", marginBottom: 10 },

  // Chat bubbles
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
    borderRadius: 10,
  },
  myBubble: {
    backgroundColor: "#d3f8d3",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  theirBubble: {
    backgroundColor: "#e8e8e8",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    color: "#388e3c",
  },
  messageText: { fontSize: 15 },

  // Input row
  inputRow: { flexDirection: "row", marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 8,
  },
  sendText: { color: "#fff", fontWeight: "bold" },

  // Bottom center back button
  backWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  backText: {
    color: "#4CAF50",
    fontWeight: "bold",
    paddingVertical: 10,
  },
});
