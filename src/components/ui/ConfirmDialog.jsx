import React, { useEffect, useRef } from "react";
import { Button } from "./Button";

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirm", 
  cancelText = "Cancel" 
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog content */}
      <div 
        ref={dialogRef}
        role="dialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="relative bg-card rounded-lg shadow-xl border border-border w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200"
      >
        <h3 id="dialog-title" className="text-lg font-bold text-text-main mb-2">
          {title}
        </h3>
        <p id="dialog-description" className="text-sm text-text-muted mb-6">
          {description}
        </p>
        
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button">
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} type="button">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
