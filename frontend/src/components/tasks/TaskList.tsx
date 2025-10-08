"use client";

import React from "react";
import type { Task, Label } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  labels: Label[];
  onToggleComplete: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskList({ tasks, labels, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl shadow-sm border p-12 text-center bg-white/80 border-orange-200/50 dark:bg-stone-900/80 dark:border-amber-900/30 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-orange-100 dark:bg-amber-900/30">
          <span className="text-4xl">🍑</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-amber-200">No tasks found</h3>
        <p className="text-sm text-gray-600 dark:text-amber-300/70">Try changing the filter or creating a new task!</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {tasks.map((t, idx) => (
        <TaskCard key={t.id ?? `task-${idx}`} task={t} labels={labels} onToggleComplete={onToggleComplete} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}


