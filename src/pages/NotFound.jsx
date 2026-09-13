import React from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import { AlertTriangle } from "lucide-react";

export function NotFound() {
  useDocumentTitle("Page Not Found");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
        <AlertTriangle size={40} className="text-amber-500" />
      </div>
      <h1 className="text-4xl font-bold text-text-main mb-4">Page not found</h1>
      <p className="text-lg text-text-muted mb-8 max-w-md">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/dashboard"
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-hover font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link 
          to="/products"
          className="px-6 py-3 bg-card text-text-main border border-border rounded-md hover:bg-gray-50 font-medium transition-colors"
        >
          Go to Products
        </Link>
      </div>
    </div>
  );
}
