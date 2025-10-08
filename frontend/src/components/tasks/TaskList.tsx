"use client";

import React from "react";
import type { Task, Label } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  labels: Label[];
  onToggleComplete: (id: string) => void;
}

export function TaskList({ tasks, labels, onToggleComplete }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map(t => (
        <TaskCard key={t.id} task={t} labels={labels} onToggleComplete={onToggleComplete} />
      ))}
    </div>
  );
}


