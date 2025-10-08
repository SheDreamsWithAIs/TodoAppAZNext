"use client";

import React, { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useTheme } from "@/contexts/theme-context";
import type { Label } from "@/types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ColorPickerModal } from "@/components/ui/ColorPickerModal";

const COLOR_PRESETS = [
  "#f97316", // orange
  "#ec4899", // pink
  "#dc2626", // red
  "#f59e0b", // amber
];

interface LabelsManagerModalProps {
  open: boolean;
  onClose: () => void;
  labels: Label[];
  onCreate: (name: string, color?: string) => void;
  onRename: (id: string, newName: string) => void;
  onRecolor: (id: string, color: string) => void;
  onDelete: (id: string) => void;
}

export function LabelsManagerModal({ open, onClose, labels, onCreate, onRename, onRecolor, onDelete }: LabelsManagerModalProps) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLOR_PRESETS[0]);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { value: string; dirty: boolean; valid: boolean }>>({});
  const [openPickerFor, setOpenPickerFor] = useState<string | null>(null);

  const normalizedSet = useMemo(() => new Set(labels.map(l => l.name_normalized)), [labels]);

  const newKey = normalize(newName);
  const isDuplicate = newKey.length > 0 && normalizedSet.has(newKey);
  const canCreate = () => newKey.length > 0 && !isDuplicate;

  function normalize(name: string) {
    return name.trim().toLowerCase();
  }

  const addLabel = () => {
    if (!canCreate()) return;
    onCreate(newName.trim(), newColor);
    setNewName("");
    setNewColor(COLOR_PRESETS[0]);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={`${darkMode ? "bg-stone-900/90 border-amber-900/50" : "bg-white border-orange-200"} rounded-2xl shadow-2xl border-2 p-6`}> 
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${darkMode ? "text-amber-100" : "text-gray-900"} text-xl font-bold`}>Manage Labels</h3>
          <button
            onClick={onClose}
            className={`${darkMode ? "border-amber-700 text-amber-300 hover:bg-amber-900/30" : "border-orange-300 text-gray-700 hover:bg-orange-50"} px-4 py-2 rounded-lg border text-sm`}
          >Close</button>
        </div>

        {/* Existing labels */}
        <div className="space-y-3 mb-6 max-h-72 overflow-auto pr-1">
          {labels.length === 0 && (
            <div className={`${darkMode ? "text-amber-300/70" : "text-gray-600"} text-sm`}>No labels yet.</div>
          )}
          {labels.map((l) => {
            const current = edits[l.id] ?? { value: l.name, dirty: false, valid: true };
            const norm = normalize(current.value);
            const valid = norm.length > 0 && (norm === l.name_normalized || !normalizedSet.has(norm));
            const setValue = (val: string) => setEdits(prev => ({ ...prev, [l.id]: { value: val, dirty: true, valid: (val.trim().toLowerCase().length > 0) && ((val.trim().toLowerCase()) === l.name_normalized || !normalizedSet.has(val.trim().toLowerCase())) } }));
            return (
              <div key={l.id} className={`${darkMode ? "bg-stone-900/60 border-amber-900/40" : "bg-white border-orange-200"} border rounded-lg p-3 flex items-center gap-3`}>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: l.color || "#f97316" }} />
                  <input
                    value={current.value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`${darkMode ? "bg-stone-800/50 text-amber-100 border-amber-900/40" : "bg-white text-gray-900 border-orange-200"} border rounded px-2 py-1 text-sm w-full`}
                  />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {/* Color button then quick swatches */}
                  <button
                    type="button"
                    onClick={() => setOpenPickerFor(l.id)}
                    className={`${darkMode ? "bg-stone-800/60 text-amber-100 hover:bg-stone-800" : "bg-orange-100 text-orange-700 hover:bg-orange-200"} px-3 py-1 rounded text-sm`}
                  >Color…</button>
                  <div className="flex items-center gap-1 mr-1">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onRecolor(l.id, c)}
                        className="w-5 h-5 rounded-full border border-black/10 dark:border-white/20"
                        style={{ backgroundColor: c }}
                        aria-label={`Set color ${c}`}
                      />
                    ))}
                  </div>
                  <button onClick={() => setPendingDelete(l.id)} className={`${darkMode ? "text-red-300 hover:bg-red-900/30" : "text-red-600 hover:bg-red-50"} px-3 py-1 rounded text-sm transition`}>
                    Delete
                  </button>
                  <button
                    onClick={() => { if (current.dirty && valid) { onRename(l.id, current.value); setEdits(prev => ({ ...prev, [l.id]: { value: current.value, dirty: false, valid } })); } }}
                    disabled={!current.dirty || !valid}
                    className={`${darkMode ? "bg-amber-800/60 text-amber-100 hover:bg-amber-800" : "bg-orange-100 text-orange-700 hover:bg-orange-200"} px-3 py-1 rounded text-sm disabled:opacity-50`}
                  >
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create new */}
        <div className="flex items-center gap-2">
          <input
            placeholder="New label name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={`${darkMode ? "bg-stone-800/50 text-amber-100 border-amber-900/40" : "bg-white text-gray-900 border-orange-200"} border rounded px-3 py-2 flex-1`}
          />
          {/* Default color swatch */}
          <div className="w-6 h-6 rounded-full border border-black/10 dark:border-white/20" style={{ backgroundColor: newColor }} aria-hidden="true" />
          <button
            type="button"
            onClick={() => setOpenPickerFor("__new__")}
            className={`${darkMode ? "bg-stone-800/60 text-amber-100 hover:bg-stone-800" : "bg-orange-100 text-orange-700 hover:bg-orange-200"} px-3 py-2 rounded text-sm`}
          >Color…</button>
          <button
            onClick={addLabel}
            disabled={!canCreate()}
            className={`${darkMode ? "bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-amber-50" : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"} px-4 py-2 rounded-lg font-semibold disabled:opacity-50`}
          >
            Add
          </button>
        </div>
        {isDuplicate && (
          <p className={`${darkMode ? "text-red-300" : "text-red-600"} text-xs mt-2`} aria-live="polite">
            A label named “{newName}” already exists (names are case‑insensitive).
          </p>
        )}
      </div>
      <ConfirmModal
        open={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) onDelete(pendingDelete); setPendingDelete(null); }}
        title="Delete label?"
        message="This will remove the label and unassign it from tasks."
        confirmText="Delete"
        cancelText="Cancel"
        size="sm"
      />
      <ColorPickerModal
        open={openPickerFor !== null}
        onClose={() => setOpenPickerFor(null)}
        color={openPickerFor && openPickerFor !== "__new__" ? (labels.find(l => l.id === openPickerFor)?.color || COLOR_PRESETS[0]) : newColor}
        onSave={(val) => {
          if (openPickerFor === "__new__") setNewColor(val);
          else if (openPickerFor) onRecolor(openPickerFor, val);
        }}
        swatches={COLOR_PRESETS}
        title="Pick a label color"
      />
    </Modal>
  );
}

function InlineNameEditor({ name, existing, onSave, darkMode }: { name: string; existing: Set<string>; onSave: (val: string) => void; darkMode: boolean; }) {
  const [value, setValue] = useState(name);
  const [dirty, setDirty] = useState(false);
  const normalized = value.trim().toLowerCase();
  const isValid = normalized.length > 0 && (!existing.has(normalized) || normalized === name.trim().toLowerCase());
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => { setValue(e.target.value); setDirty(true); }}
        className={`${darkMode ? "bg-stone-800/50 text-amber-100 border-amber-900/40" : "bg-white text-gray-900 border-orange-200"} border rounded px-2 py-1 text-sm`}
      />
      <button
        onClick={() => { if (dirty && isValid) { onSave(value); setDirty(false); } }}
        disabled={!dirty || !isValid}
        className={`${darkMode ? "bg-amber-800/60 text-amber-100 hover:bg-amber-800" : "bg-orange-100 text-orange-700 hover:bg-orange-200"} px-3 py-1 rounded text-sm disabled:opacity-50`}
      >
        Update
      </button>
    </div>
  );
}


