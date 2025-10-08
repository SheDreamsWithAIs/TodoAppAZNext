// 🐉 Type definitions for Peachy Task

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Label {
  id: string;
  user_id: string;
  name: string;
  name_normalized: string;
  color?: string;
  created_at?: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string; // ISO date string
  completed: boolean;
  label_ids: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TaskWithLabels extends Task {
  labels: Label[];
}

// Auth types (for dev mode)
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name?: string) => Promise<void>;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  label_ids: string[];
}
