import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProductStatusBadge } from "../components/products/ProductStatusBadge";
import { StockMovementModal } from "../components/stock/StockMovementModal";
import { useProducts } from "../context/ProductContext";
import { useInventory } from "../context/InventoryContext";
import { formatCurrency } from "../utils/inventory";
import { Badge } from "../components/ui/Badge";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import { useToast } from "../context/ToastContext";

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const { products } = useProducts();
  useDocumentTitle(`Product ${id}`);
  const { movements } = useInventory();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("in");

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-text-main mb-2">Product not found</h2>
        <p className="text-text-muted mb-8 max-w-md">
          The product you're looking for doesn't exist or may have been removed from the inventory system.
        </p>
        <Button onClick={() => navigate('/products')}>
          <ArrowLeft size={16} className="mr-2" /> Back to Products
        </Button>
      </div>
    );
  }

  const productMovements = movements
    .filter(m => m.productId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openModal = (mode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', month: 'short', year: 'numeric'
    }).format(d);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/products')}
          className="text-text-muted hover:text-text-main transition-colors"
          aria-label="Back to Products"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-medium text-text-muted">Back to Products</span>
      </div>

      {/* Product Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-border" 
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-100 border border-border flex items-center justify-center">
              <span className="text-xs text-text-muted">No Image</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-text-main leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <span>{product.category}</span>
              <span>•</span>
              <ProductStatusBadge stock={product.stock} minStock={product.minStock} />
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => addToast("Edit Product feature coming soon!")}>
          <Edit size={16} className="mr-2" /> Edit Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-text-muted mb-1">Description</h4>
              <p className="text-text-main">{product.description || "No description provided."}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-1">Price</h4>
                <p className="text-lg font-semibold text-text-main">{formatCurrency(product.price)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-1">Supplier</h4>
                <p className="text-text-main font-medium">{product.supplier}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-1">Category</h4>
                <p className="text-text-main">{product.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-1">Last Updated</h4>
                <p className="text-text-main">{product.lastUpdated}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-sm font-medium text-text-muted mb-1">Current Stock</h4>
                  <p className="text-3xl font-bold text-text-main">{product.stock}</p>
                </div>
                <ProductStatusBadge stock={product.stock} minStock={product.minStock} />
              </div>
              
              <div className="pt-4 border-t border-border flex justify-between">
                <span className="text-sm font-medium text-text-muted">Minimum Stock</span>
                <span className="text-sm font-medium text-text-main">{product.minStock}</span>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={() => openModal("in")} className="flex-1">
                  <ArrowDownToLine size={16} className="mr-2" /> Stock In
                </Button>
                <Button variant="outline" onClick={() => openModal("out")} className="flex-1">
                  <ArrowUpFromLine size={16} className="mr-2" /> Stock Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Stock History</CardTitle>
            </CardHeader>
            <CardContent>
              {productMovements.length > 0 ? (
                <div className="space-y-4">
                  {productMovements.map((movement) => (
                    <div key={movement.id} className="flex justify-between items-start pb-4 border-b border-border last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium text-text-main">
                          {movement.type === "Adjustment" ? "Adjustment" : movement.type}
                        </p>
                        <p className="text-xs text-text-muted mt-1">{formatDate(movement.createdAt)}</p>
                        {movement.reference && (
                          <p className="text-xs text-text-muted mt-1 break-all">Ref: {movement.reference}</p>
                        )}
                      </div>
                      <Badge 
                        status={
                          movement.type === "Stock In" ? "Stock In" :
                          movement.type === "Stock Out" ? "Stock Out" : "default"
                        }
                        className="flex-shrink-0"
                      >
                        {movement.type === "Stock In" ? "+" : movement.type === "Stock Out" ? "-" : ""}{movement.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted text-center py-4">No stock movements yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <StockMovementModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        mode={modalMode}
        preselectedProductId={product.id}
      />
    </div>
  );
}
