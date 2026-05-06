import type { Request, Response, NextFunction } from "express";
import { QuestionError } from "../types/Question.js";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof QuestionError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error." });
}
