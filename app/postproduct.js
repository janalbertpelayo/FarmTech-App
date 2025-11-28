// app/postproduct.tsx
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addProduct } from "../services/productService";
import * as ImagePicker from "expo-image-picker";
import { uploadProductImage } from "../services/productService";
import { getAuth } from "firebase/auth";
const auth = getAuth();


export default function PostProduct() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [category, setCategory] = useState("Crop");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("kg");
  const [desc, setDesc] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  // Livestock-specific fields
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const router = useRouter();

  // Unit options based on category
  const cropUnits = ["kg", "sack", "bundle", "crate"];
  const meatUnits = ["kg", "piece", "pack"];
  const livestockUnits = ["head", "pair"];
  const unitOptions = category === "Crop" ? cropUnits : category === "Meat" ? meatUnits : livestockUnits;

  const pickImage = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    alert("Permission required to access photos.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    setSelectedImage(result.assets[0].uri);
  }
};

  const handlePost = async () => {
    if (!name || !price || !quantity || (category === "Livestock" && (!breed || !age || !gender))) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    try {
      let imageUrl = "https://via.placeholder.com/100"; // Default placeholder

      if (selectedImage) {
        const file = await fetch(selectedImage);
        const blob = await file.blob();
        imageUrl = await uploadProductImage(blob, name);
      }

      await addProduct({
        image_url: imageUrl || null,
        name,
        category,
        status: "available",
        price,
        price_unit: priceUnit,
        quantity,
        quantity_unit: quantityUnit,
        desc,
        breed: category === "Livestock" ? breed : "N/A",
        age: category === "Livestock" ? age : "N/A",
        gender: category === "Livestock" ? gender : "N/A",
        createdAt: new Date(),
        user_id: currentUser?.uid,
      });

      alert(`✅ ${category} posted: ${name}`);
      setName(""); setPrice(""); setDesc(""); setQuantity(""); setBreed(""); setAge(""); setGender("");
      router.replace("/products");
    } catch (e) {
      alert("❌ Failed to post product.");
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Post Product</Text>
      <Text style={styles.subtitle}>Select Product Category</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggle, category === "Crop" && styles.activeToggle]}
          onPress={() => {
            setCategory("Crop");
            setQuantityUnit("kg");
            setPriceUnit("kg");
          }}
        >
          <Text style={[styles.toggleText, category === "Crop" && styles.activeText]}>🌾 Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggle, category === "Meat" && styles.activeToggle]}
          onPress={() => {
            setCategory("Meat");
            setQuantityUnit("kg");
            setPriceUnit("kg");
          }}
        >
          <Text style={[styles.toggleText, category === "Meat" && styles.activeText]}>🍖 Meat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggle, category === "Livestock" && styles.activeToggle]}
          onPress={() => {
            setCategory("Livestock");
            setQuantityUnit("head");
            setPriceUnit("head");
          }}
        >
          <Text style={[styles.toggleText, category === "Livestock" && styles.activeText]}>🐄 Livestock</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={pickImage}>
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.uploadBox]}>
            <Text style={styles.uploadText}>Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>


      <TextInput
        style={styles.input}
        placeholder={`${category} Name`}
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
        <View style={[styles.pickerWrapper, { flex: 1 }]}>
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
      {category === "Livestock" && (
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

      <TouchableOpacity
        style={styles.button}
        onPress={handlePost}
      >
        <Text style={styles.buttonText}>Post Product</Text>
      </TouchableOpacity>

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
  uploadBox: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f8f8f8",
  },
  uploadText: {
    color: "#888",
    fontSize: 16,
  },
});

