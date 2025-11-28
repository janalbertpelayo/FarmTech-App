// context/ProductContext.js
import React, { createContext, useState, useContext } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { doc, deleteDoc } from "firebase/firestore";

const ProductContext = createContext(null);
const docRef = doc(db, "products", "PRODUCT_ID_HERE");

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    // 🌾 Default Crops
    { id: 1, category: "Crop", name: "Tomatoes", quantity: "2 kg", price: "₱150 / kg", image_url: require("../assets/images/tomato.jpg"), breed: "N/A", age: "N/A", gender: "N/A" },
    { id: 2, category: "Crop", name: "Corn", quantity: "5 kg", price: "₱320 / kg", image_url: require("../assets/images/corn.jpg"), breed: "N/A", age: "N/A", gender: "N/A" },
    // 🍖 Default Meat
    { id: 3, category: "Meat", name: "Chicken Drumsticks", quantity: "1 kg", price: "₱200 / kg", image_url: require("../assets/images/drumstick.jpg"), breed: "N/A", age: "N/A", gender: "N/A" },
    { id: 4, category: "Meat", name: "Beef Sirloin", quantity: "1 kg", price: "₱450 / kg", image_url: require("../assets/images/beef.jpg"), breed: "N/A", age: "N/A", gender: "N/A" },
    // 🐄 Default Livestock
    { id: 5, category: "Livestock", name: "Goat", quantity: "2 head", price: "₱3500 / head", image_url: require("../assets/images/goat.png"), breed: "Boer", age: "1 year", gender: "Female" },
    { id: 6, category: "Livestock", name: "Chicken", quantity: "10 head", price: "₱250 / head", image_url: require("../assets/images/chicken.jpg"), breed: "Native", age: "6 months", gender: "Mixed" },
  ]);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Fetch user products from Firebase and merge with demo products
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "products"), where("user_id", "==", currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts((prevDemoProducts) => {
        // Keep demo products with id <= 6, merge with user products
        const demoProducts = prevDemoProducts.filter((p) => p.id <= 6);
        return [...demoProducts, ...userProducts];
      });
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, { id: Date.now(), ...newProduct }]);
  };

  const removeProduct = async (id) => {
    const product = products.find(p => p.id === id);
    // Remove from Firebase if it exists there
    if (id.toString().length > 6) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (err) {
        console.error("Failed to delete product from Firestore:", err);
      }
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);