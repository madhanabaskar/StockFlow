import React, { createContext, useContext, useState, useEffect } from "react";
import { products as mockProducts } from "../data/mockData";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("stockflow_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure we always use the latest image paths from mockData,
        // even if the user has older data cached in their browser's local storage.
        return parsed.map(p => {
          const mockP = mockProducts.find(m => m.id === p.id);
          return mockP ? { ...p, image: mockP.image } : p;
        });
      }
      return mockProducts;
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
