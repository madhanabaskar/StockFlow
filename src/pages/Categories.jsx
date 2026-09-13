import React from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { categoriesBase } from "../data/mockData";
import { useProducts } from "../context/ProductContext";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import { useToast } from "../context/ToastContext";

export function Categories() {
  useDocumentTitle("Categories");
  const { addToast } = useToast();
  const { products } = useProducts();
  
  // Dynamically map categories with fresh product data
  const categories = categoriesBase.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    const stock = catProducts.reduce((sum, p) => sum + p.stock, 0);
    return {
      ...cat,
      products: catProducts.length,
      stock,
      status: stock > 0 ? "Active" : "Archived"
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Categories" 
        description="Organize your inventory with categories."
        actionLabel={<><Plus size={16} className="mr-2" /> Add Category</>}
        onAction={() => addToast("Add Category feature coming soon!")}
      />

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-text-main group-hover:text-primary transition-colors">{category.name}</h3>
                  <Badge status={category.status} />
                </div>
                
                <p className="text-sm text-text-muted mb-6 h-10">{category.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Products</p>
                    <p className="text-xl font-medium text-text-main">{category.products}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Total Stock</p>
                    <p className="text-xl font-medium text-text-main">{category.stock}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border bg-gray-50/50 flex justify-between items-center rounded-b-lg">
                <span className="text-sm text-text-muted font-mono">{category.id}</span>
                <button className="text-sm font-medium text-primary hover:text-primary-hover">Manage</button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-text-muted bg-card border border-border rounded-lg shadow-sm">
          <p>No categories found.</p>
        </div>
      )}
    </div>
  );
}
