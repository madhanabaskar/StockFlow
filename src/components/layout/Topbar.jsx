import React from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, Menu, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

export function Topbar({ setSidebarOpen }) {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || "dashboard";
  const title = path.charAt(0).toUpperCase() + path.slice(1);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-text-muted hover:text-text-main"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold text-text-main">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-text-muted" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-border bg-transparent pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        <button 
          onClick={cycleTheme}
          className="relative p-2 rounded-full text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-main transition-colors"
          title={`Current theme: ${theme}. Click to change.`}
        >
          {theme === 'system' ? <Monitor size={20} /> : resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="relative p-2 rounded-full text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-main transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-card"></span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm cursor-pointer ml-2">
          IM
        </div>
      </div>
    </header>
  );
}
