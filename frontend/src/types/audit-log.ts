import type { Actor } from "@/constants/actors";
import type { TaskStatus } from "./task";

export interface AuditLog {
  id: string;
  taskId: string;
  actor: Actor;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  createdAt: string;
}
