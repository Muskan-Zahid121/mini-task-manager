import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: error.issues[0]?.message ?? "Invalid request"
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.status).json({ success: false, error: error.message });
    return;
  }

  const parseFailure = error as { type?: string } | null;
  if (parseFailure?.type === "entity.parse.failed") {
    res.status(400).json({ success: false, error: "Invalid JSON body" });
    return;
  }

  console.error(error);
  res.status(500).json({ success: false, error: "Internal server error" });
}
