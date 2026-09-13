import React from "react";
import { Card, CardContent } from "../ui/Card";
import { Package, ArrowRightLeft, AlertTriangle, XCircle, DollarSign } from "lucide-react";
import { formatCurrency } from "../../utils/inventory";

export function ReportSummaryCards({ products, getInventoryValue, getLowStockProducts, getOutOfStockProducts }) {
  const inventoryValue = getInventoryValue(products);
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = getLowStockProducts(products).length;
  const outOfStock = getOutOfStockProducts(products).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard title="Inventory Value" value={formatCurrency(inventoryValue)} icon={DollarSign} />
      <StatCard title="Total Products" value={totalProducts.toLocaleString('en-IN')} icon={Package} />
      <StatCard title="Total Stock" value={totalStock.toLocaleString('en-IN')} icon={ArrowRightLeft} />
      <StatCard title="Low Stock" value={lowStock.toLocaleString('en-IN')} icon={AlertTriangle} trendDown />
      <StatCard title="Out of Stock" value={outOfStock.toLocaleString('en-IN')} icon={XCircle} trendDown />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trendDown }) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <div className="p-2 rounded-full bg-gray-50 text-text-muted">
            <Icon size={16} />
          </div>
        </div>
        <h4 className={`text-xl font-bold ${trendDown && value !== "0" ? "text-red-600" : "text-text-main"}`}>
          {value}
        </h4>
      </CardContent>
    </Card>
  );
}
