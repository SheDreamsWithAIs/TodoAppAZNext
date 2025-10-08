"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useTheme } from "@/contexts/theme-context";

interface ColorPickerModalProps {
  open: boolean;
  onClose: () => void;
  color: string;
  onSave: (color: string) => void;
  swatches: string[];
  title?: string;
}

export function ColorPickerModal({ open, onClose, color, onSave, swatches, title = "Choose color" }: ColorPickerModalProps) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [value, setValue] = useState(color || "#f97316");

  return (
    <Modal open={open} onClose={onClose}>
      <div className={`${darkMode ? "bg-stone-900/90 border-amber-900/50" : "bg-white border-orange-200"} max-w-sm mx-auto rounded-2xl shadow-2xl border-2 p-5`}>
        <h3 className={`${darkMode ? "text-amber-100" : "text-gray-900"} text-base font-bold mb-3`}>{title}</h3>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="color"
            aria-label="Color"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-12 h-12 rounded overflow-hidden border border-gray-300 dark:border-amber-900/40 cursor-pointer"
          />
          <input
            aria-label="Color hex"
            readOnly
            value={value}
            onFocus={(e) => e.currentTarget.select()}
            className={`${darkMode ? "bg-stone-800/50 text-amber-100 border-amber-900/40" : "bg-white text-gray-900 border-orange-200"} border rounded px-2 py-2 text-sm w-28`}
          />
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(value)}
            className={`${darkMode ? "bg-amber-800/60 text-amber-100 hover:bg-amber-800" : "bg-orange-100 text-orange-700 hover:bg-orange-200"} px-3 py-2 rounded text-sm`}
          >Copy</button>
        </div>
        <div className="flex items-center gap-2 mb-5">
          {swatches.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setValue(c)}
              className="w-7 h-7 rounded-full border border-black/10 dark:border-white/20"
              style={{ backgroundColor: c }}
              aria-label={`Choose color ${c}`}
            />
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`${darkMode ? "border-amber-700 text-amber-300 hover:bg-amber-900/30" : "border-orange-300 text-gray-700 hover:bg-orange-50"} px-4 py-2 rounded-lg transition font-medium border-2`}
          >Cancel</button>
          <button
            onClick={() => { onSave(value); onClose(); }}
            className={`${darkMode ? "bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-amber-50" : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"} px-4 py-2 rounded-lg font-semibold`}
          >Save</button>
        </div>
      </div>
    </Modal>
  );
}


