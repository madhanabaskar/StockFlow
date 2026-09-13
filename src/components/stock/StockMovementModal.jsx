import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { useProducts } from "../../context/ProductContext";
import { useInventory } from "../../context/InventoryContext";
import { getStockStatus } from "../../utils/inventory";

export function StockMovementModal({ isOpen, onClose, mode, preselectedProductId = "" }) {
  const { products } = useProducts();
  const { addStockIn, addStockOut, adjustStock } = useInventory();
  
  const [productId, setProductId] = useState(preselectedProductId);
  const [quantity, setQuantity] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("Physical stock count");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setProductId(preselectedProductId);
      setQuantity("");
      setReference("");
      setNotes("");
      setReason("Physical stock count");
      setError("");
    }
  }, [isOpen, preselectedProductId, mode]);

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === productId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!productId) {
      setError("Please select a product");
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty)) {
      setError("Please enter a valid quantity");
      return;
    }

    if (mode === "in") {
      if (qty <= 0) {
        setError("Quantity must be greater than 0");
        return;
      }
      addStockIn(productId, qty, reference, notes);
    } else if (mode === "out") {
      if (qty <= 0) {
        setError("Quantity must be greater than 0");
        return;
      }
      if (selectedProduct && qty > selectedProduct.stock) {
        setError("Insufficient stock");
        return;
      }
      addStockOut(productId, qty, reference, notes);
    } else if (mode === "adjustment") {
      if (qty < 0) {
        setError("Stock quantity cannot be negative");
        return;
      }
      if (!reason) {
        setError("Please select a reason");
        return;
      }
      adjustStock(productId, qty, reason, reference, notes);
    }
    
    onClose();
  };

  const titles = {
    in: "Stock In",
    out: "Stock Out",
    adjustment: "Adjust Stock"
  };

  const qtyLabels = {
    in: "Quantity to Add *",
    out: "Quantity to Remove *",
    adjustment: "New Stock Quantity *"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} aria-hidden="true" />
      <div 
        className="relative bg-card rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="modal-title" className="text-lg font-semibold text-text-main">
            {titles[mode]}
          </h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6">
          <form id="stock-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="product-select" className="block text-sm font-medium text-text-main mb-1">
                Product *
              </label>
              <select
                id="product-select"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select a product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="bg-gray-50/50 p-3 rounded-md border border-border text-sm flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-text-muted">Current Stock:</span>
                  <span className="font-medium text-text-main">{selectedProduct.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Minimum Stock:</span>
                  <span className="font-medium text-text-main">{selectedProduct.minStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Status:</span>
                  <span className="font-medium text-text-main">{getStockStatus(selectedProduct.stock, selectedProduct.minStock)}</span>
                </div>
                {mode === "out" && (
                  <div className="flex justify-between mt-1 pt-1 border-t border-border">
                    <span className="text-text-muted font-medium">Available:</span>
                    <span className="font-bold text-primary">{selectedProduct.stock} units</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="qty-input" className="block text-sm font-medium text-text-main mb-1">
                {qtyLabels[mode]}
              </label>
              <input
                id="qty-input"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0"
              />
            </div>

            {mode === "adjustment" && (
              <div>
                <label htmlFor="reason-select" className="block text-sm font-medium text-text-main mb-1">
                  Reason *
                </label>
                <select
                  id="reason-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Physical stock count">Physical stock count</option>
                  <option value="Damaged item">Damaged item</option>
                  <option value="Lost item">Lost item</option>
                  <option value="Data correction">Data correction</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="ref-input" className="block text-sm font-medium text-text-main mb-1">
                Reference Number <span className="text-text-muted font-normal">(Optional)</span>
              </label>
              <input
                id="ref-input"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={mode === "in" ? "PO-2026-1045" : mode === "out" ? "SO-2026-0098" : "ADJ-2026-0041"}
              />
            </div>

            <div>
              <label htmlFor="notes-input" className="block text-sm font-medium text-text-main mb-1">
                Notes <span className="text-text-muted font-normal">(Optional)</span>
              </label>
              <textarea
                id="notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                placeholder={mode === "in" ? "New shipment received from supplier." : ""}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md">{error}</p>
            )}
          </form>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-gray-50/50 rounded-b-lg">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="stock-form">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
