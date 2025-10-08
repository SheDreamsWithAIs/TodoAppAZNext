"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";
import { User, LogOut, Plus } from "lucide-react";
import { Sidebar, type TaskFilter } from "@/components/layout/Sidebar";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskEditModal } from "@/components/tasks/TaskEditModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { LabelsManagerModal } from "@/components/labels/LabelsManagerModal";
import type { Task, Label } from "@/types";

export default function DashboardPage() {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const { user, logout } = useAuth();

  // Mock data in memory for UI verification
  const [labels, setLabels] = useState<Label[]>([
    { id: "l1", user_id: "dev", name: "Work", name_normalized: "work", color: "#f97316" },
    { id: "l2", user_id: "dev", name: "Personal", name_normalized: "personal", color: "#ec4899" },
    { id: "l3", user_id: "dev", name: "Urgent", name_normalized: "urgent", color: "#dc2626" },
  ]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", user_id: "dev", title: "Complete project documentation", description: "Write comprehensive docs for the API endpoints", priority: "high", deadline: "2025-10-15", completed: false, label_ids: ["l1","l3"] },
    { id: "t2", user_id: "dev", title: "Review pull requests", description: "Check and merge pending PRs", priority: "medium", deadline: "2025-10-10", completed: false, label_ids: ["l1"] },
    { id: "t3", user_id: "dev", title: "Grocery shopping", description: "Buy ingredients for dinner", priority: "low", deadline: "2025-10-08", completed: true, label_ids: ["l2"] },
  ]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [showNewTask, setShowNewTask] = useState<boolean>(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [showLabelsManager, setShowLabelsManager] = useState<boolean>(false);

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter(t => !t.completed);
    if (filter === "completed") return tasks.filter(t => t.completed);
    return tasks;
  }, [tasks, filter]);

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const createTask = (data: { title: string; description?: string; priority: Task["priority"]; deadline: string; label_ids: string[] }) => {
    const newTask: Task = {
      id: `t${Math.random().toString(36).slice(2, 9)}`,
      user_id: "dev",
      title: data.title,
      description: data.description,
      priority: data.priority,
      deadline: data.deadline,
      completed: false,
      label_ids: data.label_ids,
    };
    setTasks(prev => [newTask, ...prev]);
    setShowNewTask(false);
  };

  const currentEditTask = useMemo(() => tasks.find(t => t.id === editTaskId) ?? null, [tasks, editTaskId]);

  const saveTask = (id: string, data: { title: string; description?: string; priority: Task["priority"]; deadline: string; label_ids: string[] }) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    setEditTaskId(null);
  };

  const askDeleteTask = (id: string) => setDeleteTaskId(id);
  const confirmDelete = () => {
    if (!deleteTaskId) return;
    setTasks(prev => prev.filter(t => t.id !== deleteTaskId));
    setDeleteTaskId(null);
  };

  // Labels CRUD (in-memory, case-insensitive uniqueness)
  const createLabel = (name: string, color?: string) => {
    const key = name.trim().toLowerCase();
    if (!key) return;
    if (labels.some(l => l.name_normalized === key)) return;
    const id = `l${Math.random().toString(36).slice(2, 9)}`;
    setLabels(prev => [...prev, { id, user_id: "dev", name, name_normalized: key, color }]);
  };
  const renameLabel = (id: string, newName: string) => {
    const key = newName.trim().toLowerCase();
    if (!key) return;
    if (labels.some(l => l.id !== id && l.name_normalized === key)) return;
    setLabels(prev => prev.map(l => l.id === id ? { ...l, name: newName, name_normalized: key } : l));
  };
  const recolorLabel = (id: string, color: string) => {
    setLabels(prev => prev.map(l => l.id === id ? { ...l, color } : l));
  };
  const deleteLabel = (id: string) => {
    setLabels(prev => prev.filter(l => l.id !== id));
    setTasks(prev => prev.map(t => ({ ...t, label_ids: t.label_ids.filter(lid => lid !== id) })));
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen ${darkMode ? "peachy-gradient-dark" : "peachy-gradient-light"}`}>
        <header className={`shadow-md border-b ${
          darkMode
            ? "bg-gradient-to-r from-amber-900 via-orange-950 to-amber-900 border-amber-800/50"
            : "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 border-orange-400/50"
        }`}>
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${darkMode ? "bg-gradient-to-br from-amber-800 to-orange-900" : ""}`} style={darkMode ? {} : { backgroundColor: "#fce4d2" }}>
                  <span className="text-2xl">🍑</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Peachy Task</h1>
                  <p className={`text-xs italic ${darkMode ? "text-amber-200/80" : "text-orange-50/90"}`}>
                    Everything's peachy when you get things done.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle variant="header" />
                <div className={`${darkMode ? "text-amber-100" : "text-white"} flex items-center gap-2`}>
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.email ?? "dev@peachy.task"}</span>
                </div>
                <button onClick={logout} className={`${darkMode ? "text-amber-200 hover:text-amber-50 hover:bg-amber-800/50" : "text-white hover:text-white hover:bg-orange-600/40"} flex items-center gap-2 px-3 py-2 rounded-lg transition`}>
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Sidebar tasks={tasks} labels={labels} filter={filter} onChangeFilter={setFilter} onNewLabel={() => setShowLabelsManager(true)} />
            </div>
            <div className="lg:col-span-3">
              <div className="mb-6">
                <button onClick={() => setShowNewTask(v => !v)} className={`${darkMode ? "bg-gradient-to-r from-amber-800 to-orange-900 hover:from-amber-700 hover:to-orange-800 text-amber-100" : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"} w-full px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 font-medium`}>
                  <Plus className="w-5 h-5" /> New Task
                </button>
              </div>
              {showNewTask && (
                <TaskForm labels={labels} onSubmit={createTask} onCancel={() => setShowNewTask(false)} />
              )}
              <TaskList
                tasks={filteredTasks}
                labels={labels}
                onToggleComplete={toggleComplete}
                onEdit={(id) => setEditTaskId(id)}
                onDelete={askDeleteTask}
              />
            </div>
          </div>
        </main>

        <TaskEditModal
          open={!!editTaskId}
          onClose={() => setEditTaskId(null)}
          labels={labels}
          task={currentEditTask}
          onSave={saveTask}
        />

        <DeleteConfirmModal
          open={!!deleteTaskId}
          onCancel={() => setDeleteTaskId(null)}
          onConfirm={confirmDelete}
        />

        <LabelsManagerModal
          open={showLabelsManager}
          onClose={() => setShowLabelsManager(false)}
          labels={labels}
          onCreate={createLabel}
          onRename={renameLabel}
          onRecolor={recolorLabel}
          onDelete={deleteLabel}
        />
      </div>
    </div>
  );
}


