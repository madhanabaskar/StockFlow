import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  ArrowRightLeft, 
  BarChart3, 
  Settings,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Suppliers", href: "/suppliers", icon: Users },
  { name: "Stock", href: "/stock", icon: ArrowRightLeft },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Sidebar({ isOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-64 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div>
            <span className="text-xl font-bold text-text-main">StockFlow</span>
            <span className="block text-[10px] text-text-muted uppercase tracking-wider">Inventory, simplified.</span>
          </div>
          <button 
            className="md:hidden text-text-muted hover:text-text-main"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-text-muted hover:bg-gray-100 hover:text-text-main"
                )
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-4",
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-muted hover:bg-gray-100 hover:text-text-main"
              )
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
          
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-50 border border-border">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
              IM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-main truncate">Inventory Manager</p>
              <p className="text-xs text-text-muted truncate">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
