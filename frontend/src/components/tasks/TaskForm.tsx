"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import type { Label, TaskFormData } from "@/types";

interface TaskFormProps {
  labels: Label[];
  defaultValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  heading?: string;
  submitLabel?: string;
}

export function TaskForm({ labels, defaultValues, onSubmit, onCancel, heading = "Create New Task", submitLabel = "Create Task" }: TaskFormProps) {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [priority, setPriority] = useState<TaskFormData["priority"]>(defaultValues?.priority ?? "medium");
  const [deadline, setDeadline] = useState(defaultValues?.deadline ?? "");
  const [labelIds, setLabelIds] = useState<string[]>(defaultValues?.label_ids ?? []);
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  const toggleLabel = (id: string) => {
    setLabelIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { title?: string; deadline?: string } = {};
    if (!title.trim()) nextErrors.title = "Title is required";
    if (!deadline) nextErrors.deadline = "Deadline is required";
    setErrors(nextErrors);
    if (nextErrors.title || nextErrors.deadline) return;
    onSubmit({ title: title.trim(), description, priority, deadline, label_ids: labelIds });
  };

  return (
    <div className={`${darkMode ? "bg-stone-900/80 border-amber-900/30" : "bg-white/80 border-orange-200/50"} rounded-xl shadow-sm border p-6 mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${darkMode ? "bg-amber-800/50" : "bg-orange-100"} w-10 h-10 rounded-lg flex items-center justify-center`}>
            <Plus className={`${darkMode ? "text-amber-300" : "text-orange-600"} w-6 h-6`} />
          </div>
          <h3 className={`${darkMode ? "text-amber-200" : "text-gray-900"} text-xl font-bold`}>{heading}</h3>
        </div>
        <button onClick={onCancel}>
          <X className={`${darkMode ? "text-amber-400 hover:text-amber-300" : "text-gray-400 hover:text-gray-600"} w-6 h-6`} />
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={`${darkMode ? "text-amber-200" : "text-gray-700"} block text-sm font-semibold mb-2`}>Task Title <span className="text-red-500">*</span></label>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: undefined })); }}
            placeholder="What needs to be done?"
            aria-invalid={!!errors.title}
            className={`${darkMode ? "bg-stone-800/50 border-amber-900/30 text-amber-100 placeholder-amber-500/50" : "bg-white border-orange-200 text-gray-900"} w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
          />
          {errors.title && (
            <p className={`${darkMode ? "text-red-300" : "text-red-600"} text-xs mt-1`} role="alert">{errors.title}</p>
          )}
        </div>
        <div>
          <label className={`${darkMode ? "text-amber-200" : "text-gray-700"} block text-sm font-semibold mb-2`}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Add more details about this task..." className={`${darkMode ? "bg-stone-800/50 border-amber-900/30 text-amber-100 placeholder-amber-500/50" : "bg-white border-orange-200 text-gray-900"} w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`${darkMode ? "text-amber-200" : "text-gray-700"} block text-sm font-semibold mb-2`}>Priority <span className="text-red-500">*</span></label>
            <select value={priority} onChange={e => setPriority(e.target.value as any)} className={`${darkMode ? "bg-stone-800/50 border-amber-800/50 text-amber-100" : "bg-white border-orange-300 text-gray-900 focus:border-orange-400"} w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className={`${darkMode ? "text-amber-200" : "text-gray-700"} block text-sm font-semibold mb-2`}>Deadline <span className="text-red-500">*</span></label>
            <input
              value={deadline}
              onChange={e => { setDeadline(e.target.value); if (errors.deadline) setErrors(prev => ({ ...prev, deadline: undefined })); }}
              type="date"
              aria-invalid={!!errors.deadline}
              className={`${darkMode ? "bg-stone-800/50 border-amber-800/50 text-amber-100" : "bg-white border-orange-300 text-gray-900 focus:border-orange-400"} w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
            />
            {errors.deadline && (
              <p className={`${darkMode ? "text-red-300" : "text-red-600"} text-xs mt-1`} role="alert">{errors.deadline}</p>
            )}
          </div>
        </div>
        <div>
          <label className={`${darkMode ? "text-amber-200" : "text-gray-700"} block text-sm font-semibold mb-3`}>Labels <span className="text-gray-500 text-xs font-normal">(click to select)</span></label>
          <div className="flex flex-wrap gap-2">
            {labels.map(l => {
              const selected = labelIds.includes(l.id);
              return (
                <button key={l.id} type="button" onClick={() => toggleLabel(l.id)} className={`${selected ? (darkMode ? "border-amber-600 shadow-lg scale-105" : "border-orange-500 shadow-lg scale-105") : (darkMode ? "border-amber-800 hover:border-amber-600 text-amber-300" : "border-orange-200 hover:border-orange-400 text-gray-700")} px-4 py-2 rounded-full text-sm font-medium border-2 transition-all`} style={selected ? { backgroundColor: (l.color || "#f97316") + (darkMode ? "40" : "20"), borderColor: l.color || "#f97316", color: darkMode ? "#fef3c7" : (l.color || "#f97316") } : {}}>
                  {l.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-amber-900/30">
          <button type="submit" className={`${darkMode ? "bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-amber-50" : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"} flex-1 px-6 py-3 rounded-lg transition font-semibold text-base shadow-md hover:shadow-lg`}>{submitLabel}</button>
          <button type="button" onClick={onCancel} className={`${darkMode ? "border-amber-700 text-amber-300 hover:bg-amber-900/30" : "border-orange-300 text-gray-700 hover:bg-orange-50"} px-6 py-3 rounded-lg transition font-medium border-2`}>Cancel</button>
        </div>
      </form>
    </div>
  );
}


