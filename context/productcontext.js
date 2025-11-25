// context/ProductContext.tsx
import React, { createContext, useState, useContext } from "react";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    // 🌾 Default Crops
    { id: 1, category: "Crop", name: "Tomatoes", quantity: "2 kg", price: "₱150 / kg", image: "https://via.placeholder.com/100" },
    { id: 2, category: "Crop", name: "Corn", quantity: "5 kg", price: "₱320 / kg", image: "https://via.placeholder.com/100" },
    // 🍖 Default Meat
    { id: 3, category: "Meat", name: "Chicken Drumsticks", quantity: "1 kg", price: "₱200 / kg", image: "https://via.placeholder.com/100" },
    { id: 4, category: "Meat", name: "Beef Sirloin", quantity: "1 kg", price: "₱450 / kg", image: "https://via.placeholder.com/100" },
    // 🐄 Default Livestock
    { id: 5, category: "Livestock", name: "Goat", quantity: "2 head", price: "₱3500 / head", image: "https://via.placeholder.com/100", breed: "Boer", age: "1 year", gender: "Female" },
    { id: 6, category: "Livestock", name: "Chicken", quantity: "10 head", price: "₱250 / head", image: "https://via.placeholder.com/100", breed: "Native", age: "6 months", gender: "Mixed" },
  ]);

  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, { id: Date.now(), ...newProduct }]);
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
