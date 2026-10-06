import { Task } from "../../models";
import { Actor } from "../../constants/actors";
import { TaskStatus } from "../../constants/statuses";
import type { AuditLogResponse } from "../audit-logs/audit-log.types";

export interface TaskResponse {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStatusInput {
  status: TaskStatus;
  actor: Actor;
}

export interface UpdateStatusResult {
  task: TaskResponse;
  auditLog: AuditLogResponse | null;
}

export function toTaskResponse(task: Task): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };
}
