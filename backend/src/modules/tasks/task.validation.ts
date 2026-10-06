import { z } from "zod";
import { ACTORS } from "../../constants/actors";
import { TASK_STATUSES } from "../../constants/statuses";

export const taskIdParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid task id" })
});

export const createTaskSchema = z.object({
  title: z
    .string({
      required_error: "Task title is required",
      invalid_type_error: "Task title must be a string"
    })
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title must be at most 200 characters")
});

export const updateStatusSchema = z.object({
  status: z.enum(TASK_STATUSES, {
    errorMap: () => ({ message: "Invalid status" })
  }),
  actor: z.enum(ACTORS, {
    errorMap: () => ({ message: "Invalid actor" })
  })
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
