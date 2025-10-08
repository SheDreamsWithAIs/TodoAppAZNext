"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { useTheme } from "@/contexts/theme-context";
import type { Label, Task, TaskFormData } from "@/types";
import { TaskForm } from "./TaskForm";

interface TaskEditModalProps {
  open: boolean;
  onClose: () => void;
  labels: Label[];
  task: Task | null;
  onSave: (id: string, data: TaskFormData) => void;
}

export function TaskEditModal({ open, onClose, labels, task, onSave }: TaskEditModalProps) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className={`${darkMode ? "bg-stone-900/90 border-amber-900/50" : "bg-white border-orange-200"} rounded-2xl shadow-2xl border-2 p-6`}> 
        <h3 className={`${darkMode ? "text-amber-100" : "text-gray-900"} text-xl font-bold mb-4`}>Edit Task</h3>
        <TaskForm
          labels={labels}
          defaultValues={{
            title: task.title,
            description: task.description,
            priority: task.priority,
            deadline: task.deadline,
            label_ids: task.label_ids,
          }}
          onSubmit={(data) => onSave(task.id, data)}
          onCancel={onClose}
          heading="Edit Task"
          submitLabel="Save Changes"
        />
      </div>
    </Modal>
  );
}


