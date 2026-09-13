import React, { useState, useMemo } from "react";
import { Plus, XCircle } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProductTable } from "../components/products/ProductTable";
import { ProductFilters } from "../components/products/ProductFilters";
import { useProducts } from "../context/ProductContext";
import { categories, suppliers } from "../data/mockData";
import { getStockStatus } from "../utils/inventory";
import { useDocumentTitle } from "../utils/useDocumentTitle";

export function Products() {
  useDocumentTitle("Products");
  const { products } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSupplier, setSelectedSupplier] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  const hasActiveFilters = 
    searchTerm.trim() !== "" || 
    selectedCategory !== "All" || 
    selectedStatus !== "All" || 
    selectedSupplier !== "All" || 
    sortOption !== "default";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSelectedSupplier("All");
    setSortOption("default");
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase().trim();
      result = result.filter(
        p => 
          p.name.toLowerCase().includes(lowerSearch) ||
          p.sku.toLowerCase().includes(lowerSearch) ||
          p.category.toLowerCase().includes(lowerSearch) ||
          p.supplier.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Status Filter
    if (selectedStatus !== "All") {
      result = result.filter(p => getStockStatus(p.stock, p.minStock) === selectedStatus);
    }

    // 4. Supplier Filter
    if (selectedSupplier !== "All") {
      result = result.filter(p => p.supplier === selectedSupplier);
    }

    // 5. Sorting
    switch (sortOption) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "stock-desc":
        result.sort((a, b) => b.stock - a.stock);
        break;
      case "updated-desc":
        result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, selectedStatus, selectedSupplier, sortOption]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Products" 
        description="Manage your products and inventory levels."
        actionLabel={<><Plus size={16} className="mr-2" /> Add Product</>}
      />

      <Card className="overflow-hidden border-border shadow-sm flex flex-col">
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          sortOption={sortOption}
          setSortOption={setSortOption}
          categories={categories}
          suppliers={suppliers}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {filteredProducts.length > 0 ? (
          <ProductTable products={filteredProducts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <XCircle size={32} className="text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">No products found</h3>
            <p className="text-text-muted mb-6 max-w-sm">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
        
        {filteredProducts.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-muted">
            <span>Showing {filteredProducts.length} of {products.length} products</span>
          </div>
        )}
      </Card>
    </div>
  );
}
