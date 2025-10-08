"use client";

import React from "react";
import { Calendar, Check, Edit2, Flag, Tag, Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import type { Task, Label } from "@/types";

interface TaskCardProps {
  task: Task;
  labels: Label[];
  onToggleComplete: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, labels, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const labelMap = new Map(labels.map(l => [l.id, l] as const));

  const getPriorityColor = (priority: Task["priority"]) => {
    if (darkMode) {
      const colors = {
        high: "bg-red-900/50 text-red-300 border-red-800",
        medium: "bg-amber-900/50 text-amber-300 border-amber-800",
        low: "bg-emerald-900/50 text-emerald-300 border-emerald-800",
      } as const;
      return colors[priority];
    }
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-amber-100 text-amber-800 border-amber-200",
      low: "bg-emerald-100 text-emerald-800 border-emerald-200",
    } as const;
    return colors[priority];
  };

  return (
    <div className={`${darkMode ? "bg-stone-900/80 border-amber-900/30" : "bg-white/80 border-orange-200/50"} rounded-xl shadow-sm border p-5 hover:shadow-md transition ${task.completed ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-4">
        <button type="button" onClick={() => onToggleComplete(task.id)} className={`${task.completed
            ? darkMode ? "bg-amber-700 border-amber-700" : "bg-orange-500 border-orange-500"
            : darkMode ? "border-amber-700 hover:border-amber-500" : "border-orange-300 hover:border-orange-500"} mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition`}>
          {task.completed && <Check className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1">
          <h3 className={`${task.completed ? (darkMode ? "line-through text-amber-500/50" : "line-through text-gray-500") : (darkMode ? "text-amber-100" : "text-gray-900")} text-lg font-semibold mb-1`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`${darkMode ? "text-amber-300/70" : "text-gray-600"} text-sm mb-3`}>{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              <Flag className="w-3 h-3" />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <span className={`${darkMode ? "text-amber-300/70" : "text-gray-600"} inline-flex items-center gap-1 text-xs`}>
              <Calendar className="w-3 h-3" />
              {task.deadline}
            </span>
            {task.label_ids.map((id) => {
              const label = labelMap.get(id);
              if (!label) return null;
              return (
                <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium" style={{
                  backgroundColor: darkMode ? (label.color || "#6b7280") + "30" : (label.color || "#6b7280") + "20",
                  color: darkMode ? (label.color || "#6b7280") + "dd" : (label.color || "#6b7280"),
                }}>
                  <Tag className="w-3 h-3" />
                  {label.name}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => onEdit?.(task.id)} className={`${darkMode ? "text-amber-400 hover:text-amber-300 hover:bg-amber-900/50" : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"} p-2 rounded-lg transition`}>
            <Edit2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => onDelete?.(task.id)} className={`${darkMode ? "text-amber-400 hover:text-red-400 hover:bg-red-900/30" : "text-gray-400 hover:text-red-600 hover:bg-red-50"} p-2 rounded-lg transition`}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


