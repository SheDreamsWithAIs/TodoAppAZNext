"use client";

import React, { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    // Save previously focused element
    prevFocusRef.current = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const root = containerRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !root.contains(active)) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (active === last || !root.contains(active)) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    // Move initial focus
    setTimeout(() => {
      const root = containerRef.current;
      if (!root) return;
      const first = root.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }, 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      // Restore focus
      const prev = prevFocusRef.current as HTMLElement | null;
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl mx-4" ref={containerRef}>
        {children}
      </div>
    </div>
  );
}


