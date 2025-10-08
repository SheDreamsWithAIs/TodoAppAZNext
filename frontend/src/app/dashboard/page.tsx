"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { SkeletonTaskRow } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import type { Task, Label } from "@/types";
import { apiListTasks, apiCreateTask, apiUpdateTask, apiDeleteTask, apiListLabels, apiCreateLabel, apiUpdateLabel, apiDeleteLabel } from "@/lib/api";

export default function DashboardPage() {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const { user, logout } = useAuth();
  const { show } = useToast();

  // Labels loaded from API
  const [labels, setLabels] = useState<Label[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  const toggleComplete = async (id: string) => {
    const original = tasks;
    const next = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(next);
    try {
      const updated = next.find(t => t.id === id);
      await apiUpdateTask(id, { completed: updated?.completed });
    } catch (e) {
      setTasks(original);
      show("Failed to update task");
    }
  };

  const createTask = async (data: { title: string; description?: string; priority: Task["priority"]; deadline: string; label_ids: string[] }) => {
    try {
      const created = await apiCreateTask(data);
      setTasks(prev => [created, ...prev]);
      setShowNewTask(false);
      show("Task created", "success");
    } catch (e: any) {
      const msg = e?.message || "Failed to create task";
      setError(msg);
      show(msg);
    }
  };

  const currentEditTask = useMemo(() => tasks.find(t => String(t.id) === String(editTaskId)) ?? null, [tasks, editTaskId]);

  const saveTask = async (id: string, data: { title: string; description?: string; priority: Task["priority"]; deadline: string; label_ids: string[] }) => {
    const original = tasks;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    setEditTaskId(null);
    try {
      await apiUpdateTask(id, data);
    } catch (e) {
      setTasks(original);
      setError("Failed to save changes");
      show("Failed to save changes");
    }
  };

  const askDeleteTask = (id: string) => setDeleteTaskId(id);
  const confirmDelete = async () => {
    if (!deleteTaskId) return;
    const id = deleteTaskId;
    setDeleteTaskId(null);
    const original = tasks;
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await apiDeleteTask(id);
    } catch (e) {
      setTasks(original);
      setError("Failed to delete task");
      show("Failed to delete task");
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const [tasksRes, labelsRes] = await Promise.all([
          apiListTasks(),
          apiListLabels(),
        ]);
        if (!active) return;
        setTasks(tasksRes);
        setLabels(labelsRes);
      } catch (e: any) {
        if (active) {
          const msg = e?.message || "Failed to load data";
          setError(msg);
          show(msg);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Labels CRUD (API with optimistic UI)
  const createLabel = async (name: string, color?: string) => {
    try {
      const created = await apiCreateLabel(name, color);
      setLabels(prev => [...prev, created]);
    } catch (e: any) {
      const msg = e?.message || "Failed to create label";
      setError(msg);
      show(msg);
    }
  };
  const renameLabel = async (id: string, newName: string) => {
    const original = labels;
    const key = newName.trim().toLowerCase();
    setLabels(prev => prev.map(l => l.id === id ? { ...l, name: newName, name_normalized: key } : l));
    try {
      await apiUpdateLabel(id, { name: newName });
    } catch (e) {
      setLabels(original);
      setError("Failed to rename label");
      show("Failed to rename label");
    }
  };
  const recolorLabel = async (id: string, color: string) => {
    const original = labels;
    setLabels(prev => prev.map(l => l.id === id ? { ...l, color } : l));
    try {
      await apiUpdateLabel(id, { color });
    } catch (e) {
      setLabels(original);
      setError("Failed to update label color");
      show("Failed to update label color");
    }
  };
  const deleteLabel = async (id: string) => {
    const originalLabels = labels;
    const originalTasks = tasks;
    setLabels(prev => prev.filter(l => l.id !== id));
    setTasks(prev => prev.map(t => ({ ...t, label_ids: t.label_ids.filter(lid => lid !== id) })));
    try {
      await apiDeleteLabel(id);
    } catch (e) {
      setLabels(originalLabels);
      setTasks(originalTasks);
      setError("Failed to delete label");
      show("Failed to delete label");
    }
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
              {loading ? (
                <div className="space-y-3">
                  <SkeletonTaskRow />
                  <SkeletonTaskRow />
                  <SkeletonTaskRow />
                </div>
              ) : (
              <TaskList
                tasks={filteredTasks}
                labels={labels}
                onToggleComplete={toggleComplete}
                onEdit={(id) => setEditTaskId(id)}
                onDelete={(id) => askDeleteTask(id)}
              />)}
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


