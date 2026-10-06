import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import * as taskController from "./task.controller";

const router = Router();

router.get("/", asyncHandler(taskController.getTasks));
router.post("/", asyncHandler(taskController.createTask));
router.get("/:id", asyncHandler(taskController.getTask));
router.put("/:id/status", asyncHandler(taskController.updateTaskStatus));
router.delete("/:id", asyncHandler(taskController.deleteTask));

export default router;
