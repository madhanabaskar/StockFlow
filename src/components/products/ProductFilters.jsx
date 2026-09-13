import React from "react";
import { Search, X, Filter } from "lucide-react";
import { Button } from "../ui/Button";

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedSupplier,
  setSelectedSupplier,
  sortOption,
  setSortOption,
  categories,
  suppliers,
  onClearFilters,
  hasActiveFilters
}) {
  return (
    <div className="p-4 border-b border-border bg-gray-50/50 flex flex-col gap-4">
      {/* Search and Main Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search products, SKUs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-8 rounded-md border border-border text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Search products"
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
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-text-muted hover:text-red-600 hidden sm:flex"
            >
              <X size={16} className="mr-2" /> Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Secondary Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-9 rounded-md border border-border bg-card px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Filter by Category"
        >
          <option value="All">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-9 rounded-md border border-border bg-card px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Filter by Status"
        >
          <option value="All">All Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className="h-9 rounded-md border border-border bg-card px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Filter by Supplier"
        >
          <option value="All">All Suppliers</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>

        <div className="flex-1 min-w-[10px]"></div>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="h-9 rounded-md border border-border bg-card px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Sort products"
        >
          <option value="default">Sort: Default</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="stock-asc">Stock: Low → High</option>
          <option value="stock-desc">Stock: High → Low</option>
          <option value="updated-desc">Recently Updated</option>
        </select>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-text-muted hover:text-red-600 sm:hidden w-full justify-center mt-2"
          >
            <X size={16} className="mr-2" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
