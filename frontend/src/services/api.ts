import axios from "axios";
import type { Actor } from "@/constants/actors";
import type { AuditLog } from "@/types/audit-log";
import type { Task, TaskStatus } from "@/types/task";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"
});

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: string;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiFailure | undefined;
    if (data?.error) {
      return data.error;
    }
    if (error.request) {
      return "Network error: could not reach the server";
    }
  }
  return "Something went wrong";
}

export async function getTasks(): Promise<Task[]> {
  const response = await api.get<ApiSuccess<Task[]>>("/tasks");
  return response.data.data;
}

export async function getTask(id: string): Promise<Task> {
  const response = await api.get<ApiSuccess<Task>>(`/tasks/${id}`);
  return response.data.data;
}

export async function createTask(title: string): Promise<Task> {
  const response = await api.post<ApiSuccess<Task>>("/tasks", { title });
  return response.data.data;
}

export interface UpdateStatusResult {
  task: Task;
  auditLog: AuditLog | null;
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus,
  actor: Actor
): Promise<UpdateStatusResult> {
  const response = await api.put<ApiSuccess<UpdateStatusResult>>(
    `/tasks/${id}/status`,
    { status, actor }
  );
  return response.data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function getTaskAuditLogs(id: string): Promise<AuditLog[]> {
  const response = await api.get<ApiSuccess<AuditLog[]>>(`/tasks/${id}/audit-logs`);
  return response.data.data;
}
