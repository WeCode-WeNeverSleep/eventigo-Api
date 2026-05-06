import type { CreateQuestionDto, Question } from "../types/Question.js";
import { QuestionError } from "../types/Question.js";
import  prisma  from "../lib/prisma.js";

export async function listQuestions(sessionId: string): Promise<Question[]> {
  return prisma.question.findMany({
    where: { sessionId },
    orderBy: { upvotes: "desc" },
  });
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

  return prisma.question.create({
    data: {
      content: dto.content,
      authorName: dto.authorName ?? null,
      upvotes: 0,
      sessionId,
    },
  });
}

export async function upvoteQuestion(questionId: string): Promise<Question> {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw new QuestionError(`Question ${questionId} not found.`, 404);
  }

  return prisma.question.update({
    where: { id: questionId },
    data: { upvotes: { increment: 1 } },
  });
}
