import type { Task, TaskFormData, Label } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let body: any = undefined;
    try { body = await res.json(); } catch { /* ignore */ }
    const message = body?.detail || res.statusText || "Request failed";
    throw new Error(`${res.status} ${message}`);
  }
  // 204 no content
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

function normalizeTask(raw: any): Task {
  const id = raw?.id ?? raw?._id;
  return {
    id: String(id),
    user_id: raw?.user_id ?? "",
    title: raw?.title ?? "",
    description: raw?.description ?? undefined,
    priority: raw?.priority ?? "medium",
    deadline: typeof raw?.deadline === "string" ? raw.deadline : (raw?.deadline ?? ""),
    completed: Boolean(raw?.completed),
    label_ids: Array.isArray(raw?.label_ids) ? raw.label_ids : [],
    created_at: raw?.created_at ?? undefined,
    updated_at: raw?.updated_at ?? undefined,
  } as Task;
}

// Tasks API
export async function apiListTasks(limit: number = 50): Promise<Task[]> {
  const data = await request<any[]>(`/tasks/?limit=${encodeURIComponent(limit)}`);
  return data.map(normalizeTask);
}

export async function apiCreateTask(data: TaskFormData): Promise<Task> {
  const payload: any = {
    title: data.title,
    description: data.description ?? null,
    priority: data.priority,
    deadline: data.deadline, // ISO date string (YYYY-MM-DD)
    label_ids: data.label_ids ?? [],
  };
  const created = await request<any>(`/tasks/`, { method: "POST", body: JSON.stringify(payload) });
  return normalizeTask(created);
}

export async function apiUpdateTask(id: string, data: Partial<TaskFormData> & { completed?: boolean }): Promise<Task> {
  const payload: Record<string, Json> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.priority !== undefined) payload.priority = data.priority;
  if (data.deadline !== undefined) payload.deadline = data.deadline;
  if (data.label_ids !== undefined) payload.label_ids = data.label_ids;
  if (data.completed !== undefined) payload.completed = data.completed;
  const updated = await request<any>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  return normalizeTask(updated);
}

export async function apiDeleteTask(id: string): Promise<void> {
  await request<void>(`/tasks/${id}`, { method: "DELETE" });
}

// Labels API
function normalizeLabel(raw: any): Label {
  const id = raw?.id ?? raw?._id;
  return {
    id: String(id),
    user_id: raw?.user_id ?? "",
    name: raw?.name ?? "",
    name_normalized: raw?.name_normalized ?? (raw?.name ?? "").trim().toLowerCase(),
    color: raw?.color ?? undefined,
    created_at: raw?.created_at ?? undefined,
  } as Label;
}

export async function apiListLabels(): Promise<Label[]> {
  const data = await request<any[]>(`/labels/`);
  return data.map(normalizeLabel);
}

export async function apiCreateLabel(name: string, color?: string): Promise<Label> {
  const qs = new URLSearchParams({ name, ...(color ? { color } : {}) });
  const data = await request<any>(`/labels/?${qs.toString()}`, { method: "POST" });
  return normalizeLabel(data);
}

export async function apiUpdateLabel(id: string, updates: { name?: string; color?: string }): Promise<Label> {
  const qs = new URLSearchParams({ ...(updates.name ? { name: updates.name } : {}), ...(updates.color ? { color: updates.color } : {}) });
  const data = await request<any>(`/labels/${id}?${qs.toString()}`, { method: "PATCH" });
  return normalizeLabel(data);
}

export async function apiDeleteLabel(id: string): Promise<void> {
  await request<void>(`/labels/${id}`, { method: "DELETE" });
}


