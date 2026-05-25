import type { Request, Response, NextFunction } from "express";
import type { CreateQuestionDto } from "../types/Question.js";
import { listQuestions, createQuestion, upvoteQuestion } from "../services/question.service.js";

export async function getQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionId = req.params["sessionId"] as string;
    const questions = await listQuestions(sessionId);
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
}

export async function postQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionId = req.params["sessionId"] as string;
    const dto: CreateQuestionDto = {
      content: req.body.content,
      authorName: req.body.authorName,
    };
    const question = await createQuestion(sessionId, dto);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
}

export async function upvoteQuestionHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const questionId = req.params["questionId"] as string;
    const updated = await upvoteQuestion(questionId);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}
