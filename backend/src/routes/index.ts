import { Router } from "express";
import taskRoutes from "../modules/tasks/task.routes";
import auditLogRoutes from "../modules/audit-logs/audit-log.routes";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

apiRouter.use("/tasks", taskRoutes);
apiRouter.use("/tasks", auditLogRoutes);

export default apiRouter;
