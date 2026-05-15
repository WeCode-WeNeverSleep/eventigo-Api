import type { CreateQuestionDto, Question } from "../types/Question.js";
import { QuestionError } from "../types/Question.js";
import prisma from "../lib/prisma.js";
import { socketService } from "./socket.service.js";

export async function listQuestions(sessionId: string): Promise<Question[]> {
  const questions = await prisma.question.findMany({
    where: { sessionId },
    orderBy: { upvotes: "desc" },
  });

  return questions.map(q => ({
    ...q,
    createdAt: q.createdAt.toISOString(),
  }));
}

export async function createQuestion(
  sessionId: string,
  dto: CreateQuestionDto
): Promise<Question> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new QuestionError("Session not found.", 404);
  }

  const now = new Date();
  const isLive = now >= session.startTime && now <= session.endTime;

  if (!isLive) {
    throw new QuestionError("Cannot post questions outside of Live hours.", 403);
  }

  const question = await prisma.question.create({
    data: {
      content: dto.content,
      authorName: dto.authorName ?? null,
      upvotes: 0,
      sessionId,
    },
  });

  const formattedQuestion: Question = {
    ...question,
    createdAt: question.createdAt.toISOString(),
  };

  socketService.emitToRoom(`session:${sessionId}`, "new_question", formattedQuestion);

  return formattedQuestion;
}

export async function upvoteQuestion(questionId: string, userId: string): Promise<Question> {
  return await prisma.$transaction(async (tx) => {
    const question = await tx.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new QuestionError(`Question ${questionId} not found.`, 404);
    }

    const existingUpvote = await tx.upvote.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    if (existingUpvote) {
      throw new QuestionError("You have already upvoted this question.", 403);
    }

    await tx.upvote.create({
      data: {
        userId,
        questionId,
      },
    });

    const updatedQuestion = await tx.question.update({
      where: { id: questionId },
      data: { upvotes: { increment: 1 } },
    });

    const formattedQuestion: Question = {
      ...updatedQuestion,
      createdAt: updatedQuestion.createdAt.toISOString(),
    };

    socketService.emitToRoom(`session:${formattedQuestion.sessionId}`, "question_upvoted", {
      id: formattedQuestion.id,
      upvotes: formattedQuestion.upvotes
    });

    return formattedQuestion;
  });
}
