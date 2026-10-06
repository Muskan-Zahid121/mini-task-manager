import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import * as auditLogController from "./audit-log.controller";

const router = Router();

router.get("/:id/audit-logs", asyncHandler(auditLogController.getTaskAuditLogs));

export default router;
