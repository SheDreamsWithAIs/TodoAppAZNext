"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { useTheme } from "@/contexts/theme-context";

interface DeleteConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ open, onCancel, onConfirm }: DeleteConfirmModalProps) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <Modal open={open} onClose={onCancel}>
      <div className={`${darkMode ? "bg-stone-900/90 border-amber-900/50" : "bg-white border-orange-200"} rounded-2xl shadow-2xl border-2 p-6`}> 
        <h3 className={`${darkMode ? "text-amber-100" : "text-gray-900"} text-lg font-bold mb-2`}>Delete task?</h3>
        <p className={`${darkMode ? "text-amber-300/80" : "text-gray-600"} mb-4`}>This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className={`${darkMode ? "border-amber-700 text-amber-300 hover:bg-amber-900/30" : "border-orange-300 text-gray-700 hover:bg-orange-50"} px-5 py-2 rounded-lg transition font-medium border-2`}>
            Cancel
          </button>
          <button onClick={onConfirm} className={`${darkMode ? "bg-red-700 hover:bg-red-600 text-amber-50" : "bg-red-600 hover:bg-red-500 text-white"} px-5 py-2 rounded-lg transition font-semibold`}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}


