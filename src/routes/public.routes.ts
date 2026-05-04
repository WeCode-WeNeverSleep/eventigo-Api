import { Router } from "express";
import { getQuestions, postQuestion, upvoteQuestionHandler } from "../controllers/question.controller.js";

const router = Router();

router.get("/sessions/:sessionId/questions", getQuestions);
router.post("/sessions/:sessionId/questions", postQuestion);
router.post("/questions/:questionId/upvote", upvoteQuestionHandler);

export default router;