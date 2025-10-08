"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import type { Task, Label } from "@/types";

export type TaskFilter = "all" | "active" | "completed";

interface SidebarProps {
  tasks: Task[];
  labels: Label[];
  filter: TaskFilter;
  onChangeFilter: (f: TaskFilter) => void;
  onNewLabel?: () => void;
}

export function Sidebar({ tasks, labels, filter, onChangeFilter, onNewLabel }: SidebarProps) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <aside className={`rounded-xl shadow-sm border p-4 ${darkMode ? "bg-stone-900/80 border-amber-900/30 backdrop-blur-sm" : "bg-white/80 border-orange-200/50 backdrop-blur-sm"}`}>
      <h2 className={`${darkMode ? "text-amber-200" : "text-gray-900"} text-lg font-semibold mb-4`}>Filters</h2>

      <div className="space-y-2 mb-6">
        <button onClick={() => onChangeFilter("all")} className={`w-full text-left px-3 py-2 rounded-lg transition ${
          filter === "all"
            ? darkMode ? "bg-amber-900/50 text-amber-200 font-medium" : "bg-orange-100 text-orange-700 font-medium"
            : darkMode ? "text-amber-300/70 hover:bg-stone-800/50" : "text-gray-700 hover:bg-orange-50"
        }`}>All Tasks ({tasks.length})</button>
        <button onClick={() => onChangeFilter("active")} className={`w-full text-left px-3 py-2 rounded-lg transition ${
          filter === "active"
            ? darkMode ? "bg-amber-900/50 text-amber-200 font-medium" : "bg-orange-100 text-orange-700 font-medium"
            : darkMode ? "text-amber-300/70 hover:bg-stone-800/50" : "text-gray-700 hover:bg-orange-50"
        }`}>Active ({activeCount})</button>
        <button onClick={() => onChangeFilter("completed")} className={`w-full text-left px-3 py-2 rounded-lg transition ${
          filter === "completed"
            ? darkMode ? "bg-amber-900/50 text-amber-200 font-medium" : "bg-orange-100 text-orange-700 font-medium"
            : darkMode ? "text-amber-300/70 hover:bg-stone-800/50" : "text-gray-700 hover:bg-orange-50"
        }`}>Completed ({completedCount})</button>
      </div>

      <div className={`${darkMode ? "border-amber-900/30" : "border-orange-200"} border-t pt-4`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`${darkMode ? "text-amber-200" : "text-gray-900"} text-sm font-semibold`}>Labels</h3>
          <button onClick={onNewLabel} className={darkMode ? "text-amber-400 hover:text-amber-300" : "text-orange-600 hover:text-orange-700"}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {labels.length === 0 ? (
          <div className={`${darkMode ? "bg-stone-900/60 border-amber-900/30" : "bg-white/80 border-orange-200/50"} border rounded-lg p-4 text-center`}>
            <p className={`${darkMode ? "text-amber-300/80" : "text-gray-600"} text-sm mb-3`}>No labels yet. Create one to organize your tasks!</p>
            <button onClick={onNewLabel} className={`${darkMode ? "bg-amber-800/60 text-amber-100 hover:bg-amber-800" : "bg-orange-100 text-orange-700 hover:bg-orange-200"} px-3 py-2 rounded text-sm`}>
              Add Label
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {labels.map((label) => (
              <div key={label.id} className={`${darkMode ? "hover:bg-stone-800/50" : "hover:bg-orange-50"} flex items-center gap-2 px-3 py-2 rounded-lg cursor-default`}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color || "#f97316" }} />
                <span className={`${darkMode ? "text-amber-200" : "text-gray-700"} text-sm`}>{label.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}


