import React, { createContext, useContext, useState, useEffect } from "react";
import { products as mockProducts } from "../data/mockData";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("stockflow_products");
      return stored ? JSON.parse(stored) : mockProducts;
    } catch (error) {
      console.error("Failed to parse products from localStorage:", error);
      return mockProducts;
    }
  });

  useEffect(() => {
    localStorage.setItem("stockflow_products", JSON.stringify(products));
  }, [products]);

  // Update a single product's stock directly
  const updateProductStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  // Keep these stubs for Phase 4 compliance/completeness if requested later
  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };
  
  const updateProduct = (id, updates) => {
    setProducts((prev) => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        updateProductStock, 
        addProduct, 
        updateProduct, 
        deleteProduct 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
