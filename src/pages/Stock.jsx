import React, { useState, useMemo } from "react";
import { ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal, Search, X } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { StockMovementModal } from "../components/stock/StockMovementModal";
import { useInventory } from "../context/InventoryContext";
import { useProducts } from "../context/ProductContext";
import { useDocumentTitle } from "../utils/useDocumentTitle";

export function Stock() {
  useDocumentTitle("Stock Management");
  const { movements } = useInventory();
  const { products } = useProducts();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("in"); // "in", "out", "adjustment"
  
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  const openModal = (mode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const hasActiveFilters = 
    searchTerm.trim() !== "" || 
    typeFilter !== "All" || 
    dateFilter !== "All" || 
    productFilter !== "All" || 
    sortOption !== "newest";

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setDateFilter("All");
    setProductFilter("All");
    setSortOption("newest");
  };

  const filteredMovements = useMemo(() => {
    let result = [...movements];

    // Map product names for searching and display
    result = result.map(m => {
      const product = products.find(p => p.id === m.productId);
      return {
        ...m,
        productName: product ? product.name : "Deleted Product",
        productSku: product ? product.sku : "N/A"
      };
    });

    // 1. Search Filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase().trim();
      result = result.filter(m => 
        m.productName.toLowerCase().includes(lower) ||
        m.productSku.toLowerCase().includes(lower) ||
        m.reference.toLowerCase().includes(lower)
      );
    }

    // 2. Type Filter
    if (typeFilter !== "All") {
      result = result.filter(m => m.type === typeFilter);
    }

    // 3. Product Filter
    if (productFilter !== "All") {
      result = result.filter(m => m.productId === productFilter);
    }

    // 4. Date Filter
    if (dateFilter !== "All") {
      const now = new Date();
      result = result.filter(m => {
        const mDate = new Date(m.createdAt);
        const diffTime = Math.abs(now - mDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (dateFilter === "Today") return diffDays <= 1;
        if (dateFilter === "Last 7 Days") return diffDays <= 7;
        if (dateFilter === "Last 30 Days") return diffDays <= 30;
        return true;
      });
    }

    // 5. Sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime());
        break;
      case "qty-asc":
        result.sort((a, b) => a.quantity - b.quantity);
        break;
      case "qty-desc":
        result.sort((a, b) => b.quantity - a.quantity);
        break;
      default:
        break;
    }

    return result;
  }, [movements, products, searchTerm, typeFilter, dateFilter, productFilter, sortOption]);

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', month: 'short', year: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true
    }).format(d);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Stock Management" 
        description="Track stock movements in and out of your inventory."
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={() => openModal("in")} className="flex-1 sm:flex-none">
          <ArrowDownToLine size={16} className="mr-2" /> Stock In
        </Button>
        <Button variant="outline" onClick={() => openModal("out")} className="flex-1 sm:flex-none bg-card hover:bg-gray-50">
          <ArrowUpFromLine size={16} className="mr-2" /> Stock Out
        </Button>
        <Button variant="outline" onClick={() => openModal("adjustment")} className="flex-1 sm:flex-none bg-card hover:bg-gray-50">
          <SlidersHorizontal size={16} className="mr-2" /> Adjust Stock
        </Button>
      </div>

      <Card className="overflow-hidden border-border shadow-sm flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-border bg-gray-50/50 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search movements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-8 rounded-md border border-border text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label="Search movements"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-2.5 h-4 w-4 text-text-muted hover:text-text-main"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-text-muted hover:text-red-600 hidden sm:flex"
              >
                <X size={16} className="mr-2" /> Clear Filters
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-card px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Types</option>
              <option value="Stock In">Stock In</option>
              <option value="Stock Out">Stock Out</option>
              <option value="Adjustment">Adjustment</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-card px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>

            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-card px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary max-w-[200px]"
            >
              <option value="All">All Products</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <div className="flex-1 min-w-[10px]"></div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-9 rounded-md border border-border bg-card px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="qty-asc">Quantity: Low → High</option>
              <option value="qty-desc">Quantity: High → Low</option>
            </select>

            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-text-muted hover:text-red-600 sm:hidden w-full justify-center mt-2"
              >
                <X size={16} className="mr-2" /> Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredMovements.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted uppercase bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">SKU</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium text-right">Quantity</th>
                  <th className="px-6 py-4 font-medium text-right">Prev Stock</th>
                  <th className="px-6 py-4 font-medium text-right">New Stock</th>
                  <th className="px-6 py-4 font-medium">Reference</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-main">{movement.productName}</td>
                    <td className="px-6 py-4 text-text-muted">{movement.productSku}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        status={
                          movement.type === "Stock In" ? "Stock In" :
                          movement.type === "Stock Out" ? "Stock Out" : "default"
                        }
                      >
                        {movement.type === "Adjustment" ? "ADJUSTMENT" : movement.type === "Stock In" ? "IN" : "OUT"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {movement.type === "Stock In" ? "+" : movement.type === "Stock Out" ? "-" : ""}{movement.quantity}
                    </td>
                    <td className="px-6 py-4 text-right text-text-muted">{movement.previousStock}</td>
                    <td className="px-6 py-4 text-right font-medium">{movement.newStock}</td>
                    <td className="px-6 py-4 text-text-muted">{movement.reference || "-"}</td>
                    <td className="px-6 py-4 text-text-muted">{formatDate(movement.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <h3 className="text-xl font-bold text-text-main mb-2">No stock movements found</h3>
              <p className="text-text-muted mb-6 max-w-sm">
                Try adjusting your filters or record a new stock movement.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => openModal("in")} variant="outline">
                  <ArrowDownToLine size={16} className="mr-2" /> Stock In
                </Button>
                <Button onClick={() => openModal("out")} variant="outline">
                  <ArrowUpFromLine size={16} className="mr-2" /> Stock Out
                </Button>
              </div>
            </div>
          )}
        </div>

        {filteredMovements.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-muted">
            <span>Showing {filteredMovements.length} of {movements.length} movements</span>
          </div>
        )}
      </Card>

      <StockMovementModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        mode={modalMode} 
      />
    </div>
  );
}
