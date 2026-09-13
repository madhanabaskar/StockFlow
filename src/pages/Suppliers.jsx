import React from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { suppliersBase } from "../data/mockData";
import { useProducts } from "../context/ProductContext";
import { useDocumentTitle } from "../utils/useDocumentTitle";

export function Suppliers() {
  useDocumentTitle("Suppliers");
  const { products } = useProducts();

  const suppliers = suppliersBase.map(sup => {
    const supProducts = products.filter(p => p.supplierId === sup.id);
    return {
      ...sup,
      products: supProducts.length,
      status: supProducts.length > 0 ? "Active" : "Inactive"
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Suppliers" 
        description="Manage your supplier relationships and contacts."
        actionLabel={<><Plus size={16} className="mr-2" /> Add Supplier</>}
      />

      <Card className="overflow-hidden border-border shadow-sm">
        <div className="p-4 border-b border-border bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search suppliers..."
              className="w-full h-9 pl-9 pr-4 rounded-md border border-border text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {suppliers.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted uppercase bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Supplier</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium text-right">Products Supplied</th>
                  <th className="px-6 py-4 font-medium">Last Delivery</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-main">{supplier.name}</td>
                    <td className="px-6 py-4 text-text-muted">{supplier.contact}</td>
                    <td className="px-6 py-4 text-text-muted">{supplier.email}</td>
                    <td className="px-6 py-4 font-medium text-right">{supplier.products}</td>
                    <td className="px-6 py-4 text-text-muted">{supplier.lastDelivery}</td>
                    <td className="px-6 py-4">
                      <Badge status={supplier.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary-hover font-medium text-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-text-muted">
              <p>No suppliers found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
