// app/context/productcontext.js
import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Corn",
      price: 50,
      quantity: 100,
      category: "Crop",
      image_url: require("../../assets/images/corn.jpg"),
      user_id: "user1",
    },
  ]);

  const [cart, setCart] = useState([]);

  const addToCart = (product, qty, unit) => {
    setCart((prev) => [
      ...prev,
      {
        id: Date.now(),
        product,
        qty,
        unit,
      },
    ]);

    Alert.alert("Success", `"${product.name}" added to cart!`);
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{ products, setProducts, cart, addToCart, removeProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
