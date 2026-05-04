import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import type { CreateQuestionDto } from "../types/Question.js";
import { QuestionError } from "../types/Question.js";
import { listQuestions, createQuestion, upvoteQuestion } from "../services/question.service.js";

async function fetchIsSessionLive(sessionId: string): Promise<boolean> {
  void sessionId;
  throw new Error("fetchIsSessionLive() must be wired to your session service.");
}

const router = Router();

router.get(
  "/sessions/:sessionId/questions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params["sessionId"];
      if (!sessionId || Array.isArray(sessionId)) {
        res.status(400).json({ error: "sessionId is required." });
        return;
      }

      const questions = listQuestions(sessionId);
      res.status(200).json(questions);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/sessions/:sessionId/questions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params["sessionId"];
      if (!sessionId || Array.isArray(sessionId)) {
        res.status(400).json({ error: "sessionId is required." });
        return;
      }

      const dto: CreateQuestionDto = {
        content: req.body.content,
        authorName: req.body.authorName,
      };

      if (!dto.content || typeof dto.content !== "string") {
        res.status(400).json({ error: "content is required." });
        return;
      }

      const isLive = await fetchIsSessionLive(sessionId);

      const question = createQuestion(sessionId, dto, isLive);
      res.status(201).json(question);
    } catch (err) {
      if (err instanceof QuestionError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }
      next(err);
    }
  }
);

router.post(
  "/questions/:questionId/upvote",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId = req.params["questionId"];
      if (!questionId || Array.isArray(questionId)) {
        res.status(400).json({ error: "questionId is required." });
        return;
      }

      const updated = upvoteQuestion(questionId);
      if (!updated) {
        res.status(404).json({ error: `Question ${questionId} not found.` });
        return;
      }

      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
