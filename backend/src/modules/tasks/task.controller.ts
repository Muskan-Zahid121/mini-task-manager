import { Request, Response } from "express";
import { sendSuccess } from "../../utils/api-response";
import * as taskService from "./task.service";
import {
  createTaskSchema,
  taskIdParamSchema,
  updateStatusSchema
} from "./task.validation";
import { toTaskResponse } from "./task.types";
import { toAuditLogResponse } from "../audit-logs/audit-log.types";

export async function getTasks(_req: Request, res: Response): Promise<void> {
  const tasks = await taskService.listTasks();
  sendSuccess(res, tasks.map(toTaskResponse));
}

export async function getTask(req: Request, res: Response): Promise<void> {
  const { id } = taskIdParamSchema.parse(req.params);
  const task = await taskService.getTaskById(id);
  sendSuccess(res, toTaskResponse(task));
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const input = createTaskSchema.parse(req.body);
  const task = await taskService.createTask(input);
  sendSuccess(res, toTaskResponse(task), 201);
}

export async function updateTaskStatus(req: Request, res: Response): Promise<void> {
  const { id } = taskIdParamSchema.parse(req.params);
  const input = updateStatusSchema.parse(req.body);
  const result = await taskService.updateTaskStatus(id, input);
  sendSuccess(res, {
    task: toTaskResponse(result.task),
    auditLog: result.auditLog ? toAuditLogResponse(result.auditLog) : null
  });
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const { id } = taskIdParamSchema.parse(req.params);
  await taskService.deleteTask(id);
  sendSuccess(res, { message: "Task deleted successfully" });
}
