import React, { useState, useMemo } from "react";
import { Download, ChevronDown } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { useProducts } from "../context/ProductContext";
import { useInventory } from "../context/InventoryContext";

import { ReportSummaryCards } from "../components/reports/ReportSummaryCards";
import { StockMovementChart } from "../components/reports/StockMovementChart";
import { CategoryInventoryChart } from "../components/reports/CategoryInventoryChart";
import { 
  TopProductsTable, 
  MovementSummary, 
  MostActiveProducts, 
  SupplierOverview, 
  CategoryPerformance,
  AlertTable
} from "../components/reports/ReportTables";

import { 
  getInventoryValue,
  getLowStockProducts,
  getOutOfStockProducts,
  getInventoryByCategory,
  getTopProductsByValue,
  getMovementSummary,
  getMostActiveProducts,
  getSupplierOverview,
  getCategoryPerformance,
  getMovementChartData
} from "../utils/reportUtils";

import { exportInventoryCsv, exportMovementsCsv } from "../utils/exportCsv";
import { useDocumentTitle } from "../utils/useDocumentTitle";

export function Reports() {
  useDocumentTitle("Reports");
  const { products } = useProducts();
  const { movements } = useInventory();

  const [dateRangeStr, setDateRangeStr] = useState("Last 30 Days");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Derived current inventory reports
  const lowStockProducts = useMemo(() => getLowStockProducts(products), [products]);
  const outOfStockProducts = useMemo(() => getOutOfStockProducts(products), [products]);
  const inventoryByCategory = useMemo(() => getInventoryByCategory(products), [products]);
  const topProducts = useMemo(() => getTopProductsByValue(products), [products]);
  const supplierOverview = useMemo(() => getSupplierOverview(products), [products]);
  const categoryPerformance = useMemo(() => getCategoryPerformance(products), [products]);

  // Derived historical movement reports based on date filter
  const movementSummary = useMemo(() => getMovementSummary(movements, dateRangeStr), [movements, dateRangeStr]);
  const mostActiveProducts = useMemo(() => getMostActiveProducts(movements, products, dateRangeStr), [movements, products, dateRangeStr]);
  const movementChartData = useMemo(() => getMovementChartData(movements, dateRangeStr), [movements, dateRangeStr]);

  const handleExport = (type) => {
    setExportMenuOpen(false);
    if (type === "inventory") {
      exportInventoryCsv(products);
    } else if (type === "movements") {
      // Export filtered movements
      import("../utils/reportUtils").then(({ filterMovementsByDate }) => {
        const filtered = filterMovementsByDate(movements, dateRangeStr);
        exportMovementsCsv(filtered, products);
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Reports & Analytics" 
        description="Understand your inventory performance and make better stock decisions."
        actionLabel={
          <div className="relative">
            <Button onClick={() => setExportMenuOpen(!exportMenuOpen)}>
              <Download size={16} className="mr-2" /> Export Report <ChevronDown size={16} className="ml-2" />
            </Button>
            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
                <button 
                  className="w-full text-left px-4 py-3 text-sm text-text-main hover:bg-gray-50/50 transition-colors border-b border-border"
                  onClick={() => handleExport("inventory")}
                >
                  Export Inventory CSV
                </button>
                <button 
                  className="w-full text-left px-4 py-3 text-sm text-text-main hover:bg-gray-50/50 transition-colors"
                  onClick={() => handleExport("movements")}
                >
                  Export Stock Movements CSV
                </button>
              </div>
            )}
            {/* Click away overlay */}
            {exportMenuOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)}></div>
            )}
          </div>
        }
      />

      <ReportSummaryCards 
        products={products} 
        getInventoryValue={getInventoryValue}
        getLowStockProducts={getLowStockProducts}
        getOutOfStockProducts={getOutOfStockProducts}
      />

      {/* Date Filter Row for Movement Data */}
      <div className="flex items-center justify-between border-b border-border pb-4 mt-8">
        <h3 className="text-lg font-semibold text-text-main">Movement Analytics</h3>
        <select
          value={dateRangeStr}
          onChange={(e) => setDateRangeStr(e.target.value)}
          className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-medium"
        >
          <option value="All Time">All Time</option>
          <option value="Today">Today</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Last 90 Days">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StockMovementChart data={movementChartData} />
        <MovementSummary data={movementSummary} dateRangeStr={dateRangeStr} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MostActiveProducts data={mostActiveProducts} dateRangeStr={dateRangeStr} />
        </div>
        <div className="lg:col-span-2">
          <TopProductsTable data={topProducts} />
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-text-main mb-6">Inventory Breakdowns</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategoryInventoryChart data={inventoryByCategory} />
          <div className="lg:col-span-2">
            <CategoryPerformance data={categoryPerformance} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertTable title="Low Stock Items" data={lowStockProducts} type="low" />
        <AlertTable title="Out of Stock Items" data={outOfStockProducts} type="out" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SupplierOverview data={supplierOverview} />
      </div>

    </div>
  );
}
