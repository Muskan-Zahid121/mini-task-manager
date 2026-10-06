import { AuditLog } from "./audit-log.model";
import { Task } from "./task.model";

Task.hasMany(AuditLog, {
  foreignKey: "taskId",
  as: "auditLogs"
});

AuditLog.belongsTo(Task, {
  foreignKey: "taskId",
  as: "task"
});

export { Task } from "./task.model";
export { AuditLog } from "./audit-log.model";
