import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { formatCurrency } from "../../utils/inventory";

export function ProductTable({ products }) {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-muted uppercase bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 font-medium">Product</th>
            <th className="px-6 py-4 font-medium">SKU</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Price</th>
            <th className="px-6 py-4 font-medium text-right">Stock</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => (
            <tr 
              key={product.id} 
              className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
              onClick={() => navigate(`/products/${product.id}`)}
              tabIndex={0}
              role="link"
              aria-label={`View details for ${product.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/products/${product.id}`);
                }
              }}
            >
              <td className="px-6 py-4 font-medium text-text-main flex items-center gap-3">
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-8 h-8 rounded-md object-cover bg-gray-100 border border-border" 
                  />
                )}
                {product.name}
              </td>
              <td className="px-6 py-4 text-text-muted">{product.sku}</td>
              <td className="px-6 py-4 text-text-muted">{product.category}</td>
              <td className="px-6 py-4 text-text-muted">{formatCurrency(product.price)}</td>
              <td className="px-6 py-4 font-medium text-right">{product.stock}</td>
              <td className="px-6 py-4">
                <ProductStatusBadge stock={product.stock} minStock={product.minStock} />
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  className="text-text-muted hover:text-primary transition-colors inline-flex items-center justify-center p-1"
                  aria-label={`View ${product.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${product.id}`);
                  }}
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
