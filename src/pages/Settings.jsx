import React, { useState, useEffect } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

export function Settings() {
  useDocumentTitle("Settings");
  const { addToast } = useToast();
  const { theme, setTheme } = useTheme();

  // Profile State
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("stockflow_profile");
      return stored ? JSON.parse(stored) : { name: "Alex Morgan", email: "alex@stockflow.demo", role: "Inventory Manager" };
    } catch {
      return { name: "Alex Morgan", email: "alex@stockflow.demo", role: "Inventory Manager" };
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("stockflow_notifications");
      return stored ? JSON.parse(stored) : { lowStockAlerts: true, outOfStockAlerts: true, stockMovementNotifications: true, reportReminders: false };
    } catch {
      return { lowStockAlerts: true, outOfStockAlerts: true, stockMovementNotifications: true, reportReminders: false };
    }
  });

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Handlers
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      addToast("Name and email are required.", "error");
      return;
    }
    localStorage.setItem("stockflow_profile", JSON.stringify(profile));
    addToast("Profile updated successfully");
  };

  const toggleNotification = (key) => {
    const newPrefs = { ...notifications, [key]: !notifications[key] };
    setNotifications(newPrefs);
    localStorage.setItem("stockflow_notifications", JSON.stringify(newPrefs));
  };

  const handleResetDemoData = () => {
    // Remove only specific StockFlow keys
    const keysToRemove = [
      "stockflow_products",
      "stockflow_movements",
      "stockflow_profile",
      "stockflow_notifications",
      "stockflow_theme"
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    setIsResetDialogOpen(false);
    
    // Safely reload the application to re-initialize contexts from mockData
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <PageHeader 
        title="Settings" 
        description="Manage your profile, preferences, and application data."
      />

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full h-10 px-3 rounded-md border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full h-10 px-3 rounded-md border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Role</label>
              <input 
                type="text" 
                value={profile.role}
                disabled
                className="w-full h-10 px-3 rounded-md border border-border bg-gray-50 text-text-muted cursor-not-allowed"
              />
              <p className="text-xs text-text-muted mt-1">Role cannot be changed in the demo.</p>
            </div>
            <div className="pt-2">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="theme-light" 
                name="theme" 
                checked={theme === "light"} 
                onChange={() => setTheme("light")} 
                className="text-primary focus:ring-primary"
              />
              <label htmlFor="theme-light" className="text-sm font-medium text-text-main">Light</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="theme-dark" 
                name="theme" 
                checked={theme === "dark"} 
                onChange={() => setTheme("dark")}
                className="text-primary focus:ring-primary"
              />
              <label htmlFor="theme-dark" className="text-sm font-medium text-text-main">Dark</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="radio" 
                id="theme-system" 
                name="theme" 
                checked={theme === "system"} 
                onChange={() => setTheme("system")}
                className="text-primary focus:ring-primary"
              />
              <label htmlFor="theme-system" className="text-sm font-medium text-text-main">System <span className="text-xs text-text-muted font-normal">(Follows OS preference)</span></label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <ToggleSwitch 
              label="Low stock alerts" 
              checked={notifications.lowStockAlerts} 
              onChange={() => toggleNotification('lowStockAlerts')} 
            />
            <ToggleSwitch 
              label="Out-of-stock alerts" 
              checked={notifications.outOfStockAlerts} 
              onChange={() => toggleNotification('outOfStockAlerts')} 
            />
            <ToggleSwitch 
              label="Stock movement notifications" 
              checked={notifications.stockMovementNotifications} 
              onChange={() => toggleNotification('stockMovementNotifications')} 
            />
            <ToggleSwitch 
              label="Report reminders" 
              checked={notifications.reportReminders} 
              onChange={() => toggleNotification('reportReminders')} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-500">Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-text-main">Reset Demo Data</h4>
              <p className="text-sm text-text-muted mt-1 max-w-md">
                Restore StockFlow to its original demo state. This will remove your current products, stock movements, and preference changes.
              </p>
            </div>
            <Button variant="danger" onClick={() => setIsResetDialogOpen(true)}>
              Reset Demo Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog 
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetDemoData}
        title="Reset all demo data?"
        description="This will remove your current product, stock movement and preference changes and restore the original demo data. This action cannot be undone."
        confirmText="Reset Demo Data"
        cancelText="Cancel"
      />
    </div>
  );
}

// Simple toggle switch component for settings
function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-text-main">{label}</span>
      <button 
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
