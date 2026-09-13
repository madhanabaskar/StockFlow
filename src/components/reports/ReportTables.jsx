import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "../../utils/inventory";
import { ProductStatusBadge } from "../products/ProductStatusBadge";

export function TopProductsTable({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products by Inventory Value</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        {data.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium text-right">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Price</th>
                <th className="px-6 py-4 font-medium text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-main">
                    <span className="text-text-muted mr-2">{i + 1}.</span>{p.name}
                  </td>
                  <td className="px-6 py-4 text-text-muted">{p.sku}</td>
                  <td className="px-6 py-4 text-right font-medium">{p.stock}</td>
                  <td className="px-6 py-4 text-right text-text-muted">{formatCurrency(p.price)}</td>
                  <td className="px-6 py-4 text-right font-medium text-primary">{formatCurrency(p.stock * p.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyTable message="No products available." />
        )}
      </div>
    </Card>
  );
}

export function MovementSummary({ data, dateRangeStr }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement Summary ({dateRangeStr})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50/50 p-4 rounded-lg border border-border">
            <p className="text-sm font-medium text-text-muted mb-1">Total Stock In</p>
            <p className="text-2xl font-bold text-emerald-600">+{data.totalIn}</p>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-lg border border-border">
            <p className="text-sm font-medium text-text-muted mb-1">Total Stock Out</p>
            <p className="text-2xl font-bold text-amber-500">-{data.totalOut}</p>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-lg border border-border">
            <p className="text-sm font-medium text-text-muted mb-1">Adjustments</p>
            <p className="text-2xl font-bold text-blue-500">{data.adjustments}</p>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-lg border border-border">
            <p className="text-sm font-medium text-text-muted mb-1">Net Movement</p>
            <p className={`text-2xl font-bold ${data.netMovement >= 0 ? "text-emerald-600" : "text-amber-500"}`}>
              {data.netMovement > 0 ? "+" : ""}{data.netMovement}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MostActiveProducts({ data, dateRangeStr }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Active Products ({dateRangeStr})</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        {data.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium text-right">Transactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-main">
                    <span className="text-text-muted mr-2">{i + 1}.</span>{p.name}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    <Badge status="default">{p.count} movements</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyTable message="No movement data available." />
        )}
      </div>
    </Card>
  );
}

export function SupplierOverview({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Inventory Overview</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto h-[350px]">
        {data.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-gray-50/50 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium text-right">Products</th>
                <th className="px-6 py-4 font-medium text-right">Total Stock</th>
                <th className="px-6 py-4 font-medium text-right">Inventory Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((s) => (
                <tr key={s.name} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-main">{s.name}</td>
                  <td className="px-6 py-4 text-right text-text-muted">{s.productCount}</td>
                  <td className="px-6 py-4 text-right font-medium">{s.totalStock}</td>
                  <td className="px-6 py-4 text-right font-medium text-primary">{formatCurrency(s.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyTable message="No supplier data available." />
        )}
      </div>
    </Card>
  );
}

export function CategoryPerformance({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Performance</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto h-[350px]">
        {data.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-gray-50/50 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Products</th>
                <th className="px-6 py-4 font-medium text-right">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Value</th>
                <th className="px-6 py-4 font-medium text-center">Low Stock</th>
                <th className="px-6 py-4 font-medium text-center">Out of Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((c) => (
                <tr key={c.name} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-main">{c.name}</td>
                  <td className="px-6 py-4 text-right text-text-muted">{c.productCount}</td>
                  <td className="px-6 py-4 text-right font-medium">{c.totalStock}</td>
                  <td className="px-6 py-4 text-right font-medium text-primary">{formatCurrency(c.totalValue)}</td>
                  <td className="px-6 py-4 text-center">
                    {c.lowStock > 0 ? <span className="text-amber-500 font-medium">{c.lowStock}</span> : "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {c.outOfStock > 0 ? <span className="text-red-500 font-medium">{c.outOfStock}</span> : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyTable message="No category data available." />
        )}
      </div>
    </Card>
  );
}

export function AlertTable({ title, data, type }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={type === "out" ? "text-red-600" : "text-amber-500"}>{title}</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto max-h-[300px]">
        {data.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-gray-50/50 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium text-right">Current Stock</th>
                {type === "low" && <th className="px-6 py-4 font-medium text-right">Min Stock</th>}
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-main">{p.name}</td>
                  <td className="px-6 py-4 text-text-muted">{p.sku}</td>
                  <td className="px-6 py-4 text-text-muted">{p.supplier}</td>
                  <td className="px-6 py-4 text-right font-bold text-text-main">{p.stock}</td>
                  {type === "low" && <td className="px-6 py-4 text-right text-text-muted">{p.minStock}</td>}
                  <td className="px-6 py-4">
                    <ProductStatusBadge stock={p.stock} minStock={p.minStock} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyTable message={type === "out" ? "All products are currently in stock." : "No low stock products."} />
        )}
      </div>
    </Card>
  );
}

function EmptyTable({ message }) {
  return (
    <div className="p-8 text-center text-text-muted flex items-center justify-center border-t border-border">
      <p>{message}</p>
    </div>
  );
}
