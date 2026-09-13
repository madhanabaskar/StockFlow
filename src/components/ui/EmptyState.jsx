import React from "react";

export function EmptyState({ title, description, icon: Icon, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card border border-border border-dashed rounded-lg shadow-sm">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-border">
          <Icon size={32} className="text-text-muted" />
        </div>
      )}
      <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
      {description && <p className="text-text-muted mb-6 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <button 
          onClick={onAction} 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
