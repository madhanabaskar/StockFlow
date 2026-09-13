import React, { createContext, useContext, useState, useEffect } from "react";
import { useProducts } from "./ProductContext";
import { useToast } from "./ToastContext";
import { stockMovementsRaw } from "../data/mockData";

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const { products, updateProductStock } = useProducts();
  const { addToast } = useToast();

  const [movements, setMovements] = useState(() => {
    try {
      const stored = localStorage.getItem("stockflow_movements");
      let parsed = stored ? JSON.parse(stored) : stockMovementsRaw;
      
      return parsed.map(m => {
        if (!m.createdAt) {
          return { 
            ...m, 
            createdAt: m.date ? new Date(m.date).toISOString() : new Date().toISOString() 
          };
        }
        return m;
      });
    } catch (error) {
      console.error("Failed to parse movements from localStorage:", error);
      return stockMovementsRaw;
    }
  });

  useEffect(() => {
    localStorage.setItem("stockflow_movements", JSON.stringify(movements));
  }, [movements]);

  const recordMovement = ({ productId, type, quantity, previousStock, newStock, reference, reason, notes }) => {
    const movement = {
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      type,
      quantity,
      previousStock,
      newStock,
      reference: reference || "",
      reason: reason || "",
      notes: notes || "",
      createdAt: new Date().toISOString()
    };
    
    setMovements((prev) => [movement, ...prev]);
    updateProductStock(productId, newStock);
  };

  const addStockIn = (productId, quantity, reference, notes) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (quantity <= 0) {
      addToast("Quantity must be greater than 0", "error");
      return;
    }

    const previousStock = product.stock;
    const newStock = previousStock + quantity;
    
    recordMovement({ productId, type: "Stock In", quantity, previousStock, newStock, reference, notes });
    addToast("Stock added successfully");
  };

  const addStockOut = (productId, quantity, reference, notes) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (quantity <= 0) {
      addToast("Quantity must be greater than 0", "error");
      return;
    }

    if (quantity > product.stock) {
      addToast("Insufficient stock", "error");
      return;
    }

    const previousStock = product.stock;
    const newStock = previousStock - quantity;
    
    recordMovement({ productId, type: "Stock Out", quantity, previousStock, newStock, reference, notes });
    addToast("Stock removed successfully");
  };

  const adjustStock = (productId, newStockQuantity, reason, reference, notes) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (newStockQuantity < 0) {
      addToast("Stock quantity cannot be negative", "error");
      return;
    }

    const previousStock = product.stock;
    const newStock = newStockQuantity;
    // For adjustment, quantity is usually the absolute difference, or we can just save it as the new target.
    // The prompt says: "For adjustments, quantity can represent the new target stock quantity."
    
    recordMovement({ productId, type: "Adjustment", quantity: newStockQuantity, previousStock, newStock, reference, reason, notes });
    addToast("Stock adjusted successfully");
  };

  return (
    <InventoryContext.Provider value={{ movements, addStockIn, addStockOut, adjustStock }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
