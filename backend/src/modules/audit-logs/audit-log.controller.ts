import { Request, Response } from "express";
import { sendSuccess } from "../../utils/api-response";
import { taskIdParamSchema } from "../tasks/task.validation";
import { toAuditLogResponse } from "./audit-log.types";
import * as auditLogService from "./audit-log.service";

export async function getTaskAuditLogs(req: Request, res: Response): Promise<void> {
  const { id } = taskIdParamSchema.parse(req.params);
  const auditLogs = await auditLogService.listAuditLogsForTask(id);
  sendSuccess(res, auditLogs.map(toAuditLogResponse));
}
