"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Toast = { id: string; message: string; variant?: "error" | "success" | "info" };

const ToastContext = createContext<{
  show: (message: string, variant?: Toast["variant"]) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = (message: string, variant: Toast["variant"] = "error") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };
  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-lg px-4 py-3 shadow-lg text-sm text-white ${
            t.variant === "success" ? "bg-green-600" : t.variant === "info" ? "bg-blue-600" : "bg-red-600"
          }`}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}


