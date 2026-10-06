import { AppError } from "../../utils/app-error";
import { AuditLog, Task } from "../../models";

export async function listAuditLogsForTask(taskId: string): Promise<AuditLog[]> {
  // Soft-deleted tasks keep their audit history viewable.
  const task = await Task.findByPk(taskId, { paranoid: false });
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return AuditLog.findAll({
    where: { taskId },
    order: [["createdAt", "ASC"]]
  });
}
