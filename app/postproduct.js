// app/postproduct.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useProducts } from "../context/productcontext";
import { Picker } from "@react-native-picker/picker";

export default function PostProduct() {
  const [type, setType] = useState("Crop");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("kg");
  const [desc, setDesc] = useState("");
  // Livestock-specific fields
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const router = useRouter();
  const { addProduct } = useProducts();

  // Unit options based on type
  const cropUnits = ["kg", "sack", "bundle", "crate"];
  const meatUnits = ["kg", "piece", "pack"];
  const livestockUnits = ["head", "pair"];
  const unitOptions = type === "Crop" ? cropUnits : type === "Meat" ? meatUnits : livestockUnits;

  const handlePost = () => {
    if (!name || !price || !quantity || (type === "Livestock" && (!breed || !age || !gender))) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    const newProduct = {
      category: type,
      name: `${name}`,
      quantity: `${quantity} ${quantityUnit}`,
      price: `₱${price} / ${priceUnit}`,
      desc,
      image: "https://via.placeholder.com/100",
      ...(type === "Livestock" && { breed, age, gender }),
    };

    addProduct(newProduct); // Save to global list
    alert(`✅ ${type} posted: ${name}`);
    setName(""); setPrice(""); setDesc(""); setQuantity(""); setBreed(""); setAge(""); setGender("");

    router.replace("/products"); // Go to My Products after posting
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Post Product</Text>
      <Text style={styles.subtitle}>Select Product Type</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggle, type === "Crop" && styles.activeToggle]}
          onPress={() => {
            setType("Crop");
            setQuantityUnit("kg");
            setPriceUnit("kg");
          }}
        >
          <Text style={[styles.toggleText, type === "Crop" && styles.activeText]}>🌾 Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggle, type === "Meat" && styles.activeToggle]}
          onPress={() => {
            setType("Meat");
            setQuantityUnit("kg");
            setPriceUnit("kg");
          }}
        >
          <Text style={[styles.toggleText, type === "Meat" && styles.activeText]}>🍖 Meat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggle, type === "Livestock" && styles.activeToggle]}
          onPress={() => {
            setType("Livestock");
            setQuantityUnit("head");
            setPriceUnit("head");
          }}
        >
          <Text style={[styles.toggleText, type === "Livestock" && styles.activeText]}>🐄 Livestock</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require("../assets/images/logo.png")}
        style={styles.image}
      />

      <TextInput
        style={styles.input}
        placeholder={`${type} Name`}
        value={name}
        onChangeText={setName}
      />

      {/* Quantity row with dropdown */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 2, marginRight: 8, marginBottom: 0 }]}
          placeholder={`Quantity`}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <View style={[styles.pickerWrapper, { flex: 1}]}>
          <Picker
            selectedValue={quantityUnit}
            onValueChange={setQuantityUnit}
            style={styles.picker}
            dropdownIconColor="#4CAF50"
          >
            {unitOptions.map((unit) => (
              <Picker.Item key={unit} label={unit} value={unit} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Price row with dropdown */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 2, marginRight: 8, marginBottom: 0 }]}
          placeholder="Price (₱)"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <View style={[styles.pickerWrapper, { flex: 1 }]}>
          <Picker
            selectedValue={priceUnit}
            onValueChange={setPriceUnit}
            style={styles.picker}
            dropdownIconColor="#4CAF50"
          >
            {unitOptions.map((unit) => (
              <Picker.Item key={unit} label={unit} value={unit} />
            ))}
          </Picker>
        </View>
      </View>

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
        multiline
      />

      {/* Livestock-specific fields */}
      {type === "Livestock" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={breed}
            onChangeText={setBreed}
          />
          <TextInput
            style={styles.input}
            placeholder="Age (e.g. 1 year, 6 months)"
            value={age}
            onChangeText={setAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Post {type}</Text>
      </TouchableOpacity>

      {/* Move the back button to the very bottom using flex */}
      <View style={{ flex: 1 }} />
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#2E7D32" },
  subtitle: { fontSize: 16, marginBottom: 10, color: "#555" },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  toggle: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeToggle: { backgroundColor: "#4CAF50" },
  toggleText: { fontWeight: "bold", color: "#4CAF50" },
  activeText: { color: "#fff" },
  image: { width: "100%", height: 180, backgroundColor: "#eee", borderRadius: 8, marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 6 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 44,
    justifyContent: "center",
  },
  picker: {
    height: 66,
    width: "100%",
    color: "#555",
  },
  button: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 6, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  backText: { marginTop: 15, color: "#4CAF50", textAlign: "center"
  },
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

