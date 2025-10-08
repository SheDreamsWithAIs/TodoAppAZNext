"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { useTheme } from "@/contexts/theme-context";

interface ConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  size?: "sm" | "md";
}

export function ConfirmModal({ open, onCancel, onConfirm, title = "Are you sure?", message, confirmText = "Confirm", cancelText = "Cancel", size = "md" }: ConfirmModalProps) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const sizeClasses = size === "sm" ? "max-w-sm" : "max-w-2xl";

  return (
    <Modal open={open} onClose={onCancel}>
      <div className={`${darkMode ? "bg-stone-900/90 border-amber-900/50" : "bg-white border-orange-200"} ${sizeClasses} mx-auto rounded-2xl shadow-2xl border-2 p-5`}> 
        <h3 className={`${darkMode ? "text-amber-100" : "text-gray-900"} text-base font-bold mb-2`}>{title}</h3>
        {message && (
          <p className={`${darkMode ? "text-amber-300/80" : "text-gray-600"} mb-4 text-sm`}>{message}</p>
        )}
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className={`${darkMode ? "border-amber-700 text-amber-300 hover:bg-amber-900/30" : "border-orange-300 text-gray-700 hover:bg-orange-50"} px-4 py-2 rounded-lg transition font-medium border-2`}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`${darkMode ? "bg-red-700 hover:bg-red-600 text-amber-50" : "bg-red-600 hover:bg-red-500 text-white"} px-4 py-2 rounded-lg transition font-semibold`}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}


