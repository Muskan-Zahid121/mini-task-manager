import { sequelize } from "../../config/database";
import { AppError } from "../../utils/app-error";
import { isValidStatusTransition } from "../../utils/status-transition";
import { AuditLog, Task } from "../../models";
import { CreateTaskInput, UpdateStatusInput } from "./task.validation";

export async function listTasks(): Promise<Task[]> {
  return Task.findAll({
    order: [["createdAt", "DESC"]]
  });
}

export async function getTaskById(id: string): Promise<Task> {
  const task = await Task.findByPk(id);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  return task;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  return Task.create({ title: input.title });
}

export async function updateTaskStatus(
  id: string,
  input: UpdateStatusInput
): Promise<{ task: Task; auditLog: AuditLog | null }> {
  return sequelize.transaction(async (transaction) => {
    const task = await Task.findOne({
      where: { id },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (task.status === input.status) {
      return { task, auditLog: null };
    }

    if (!isValidStatusTransition(task.status, input.status)) {
      throw new AppError(
        `Invalid status transition from ${task.status} to ${input.status}`,
        400
      );
    }

    const fromStatus = task.status;
    task.status = input.status;
    await task.save({ transaction });

    const auditLog = await AuditLog.create(
      {
        taskId: task.id,
        actor: input.actor,
        fromStatus,
        toStatus: input.status
      },
      { transaction }
    );

    return { task, auditLog };
  });
}

export async function deleteTask(id: string): Promise<void> {
  const task = await getTaskById(id);
  await task.destroy();
}
