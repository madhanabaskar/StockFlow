import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { ProductProvider } from "./context/ProductContext";
import { InventoryProvider } from "./context/InventoryContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { ProductDetails } from "./pages/ProductDetails";
import { Categories } from "./pages/Categories";
import { Suppliers } from "./pages/Suppliers";
import { Stock } from "./pages/Stock";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ProductProvider>
          <InventoryProvider>
            <ErrorBoundary>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:id" element={<ProductDetails />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="suppliers" element={<Suppliers />} />
                    <Route path="stock" element={<Stock />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </InventoryProvider>
        </ProductProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
