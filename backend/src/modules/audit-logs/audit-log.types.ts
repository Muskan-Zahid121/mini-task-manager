import { AuditLog } from "../../models";
import { Actor } from "../../constants/actors";
import { TaskStatus } from "../../constants/statuses";

export interface AuditLogResponse {
  id: string;
  taskId: string;
  actor: Actor;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  createdAt: string;
}

export function toAuditLogResponse(auditLog: AuditLog): AuditLogResponse {
  return {
    id: auditLog.id,
    taskId: auditLog.taskId,
    actor: auditLog.actor,
    fromStatus: auditLog.fromStatus,
    toStatus: auditLog.toStatus,
    createdAt: auditLog.createdAt.toISOString()
  };
}
