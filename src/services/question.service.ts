import type { CreateQuestionDto, Question } from "../types/Question.js";
import { QuestionError } from "../types/Question.js";
import prisma from "../lib/prisma.js";
import { socketService } from "./socket.service.js";

type QuestionWithCount = {
  id: string;
  content: string;
  authorName: string | null;
  sessionId: string;
  createdAt: Date;
  _count: {
    upvoteList: number;
  };
};

function formatQuestion(question: QuestionWithCount): Question {
  return {
    id: question.id,
    content: question.content,
    authorName: question.authorName,
    sessionId: question.sessionId,
    createdAt: question.createdAt.toISOString(),
    upvotes: question._count.upvoteList,
  };
}

export async function listQuestions(sessionId: string): Promise<Question[]> {
  const questions = await prisma.question.findMany({
    where: { sessionId },
    include: {
      _count: {
        select: {
          upvoteList: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return questions
    .map(formatQuestion)
    .sort((a, b) => b.upvotes - a.upvotes);
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
    throw new QuestionError("Cannot post questions outside of live hours.", 403);
  }

  const question = await prisma.question.create({
    data: {
      content: dto.content,
      authorName: dto.authorName ?? null,
      sessionId,
    },
    include: {
      _count: {
        select: {
          upvoteList: true,
        },
      },
    },
  });

  const formattedQuestion = formatQuestion(question);

  socketService.emitToRoom(
    `session:${sessionId}`,
    "new_question",
    formattedQuestion
  );

  return formattedQuestion;
}

export async function upvoteQuestion(
  questionId: string,
  userId: string
): Promise<Question> {
  try {
    const question = await prisma.$transaction(async (tx) => {
      const existingQuestion = await tx.question.findUnique({
        where: { id: questionId },
      });

      if (!existingQuestion) {
        throw new QuestionError(`Question ${questionId} not found.`, 404);
      }

      await tx.upvote.create({
        data: {
          userId,
          questionId,
        },
      });

      const updatedQuestion = await tx.question.findUnique({
        where: { id: questionId },
        include: {
          _count: {
            select: {
              upvoteList: true,
            },
          },
        },
      });

      if (!updatedQuestion) {
        throw new QuestionError(`Question ${questionId} not found.`, 404);
      }

      return updatedQuestion;
    });

    const formattedQuestion = formatQuestion(question);

    socketService.emitToRoom(
      `session:${formattedQuestion.sessionId}`,
      "question_upvoted",
      {
        id: formattedQuestion.id,
        upvotes: formattedQuestion.upvotes,
      }
    );

    return formattedQuestion;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new QuestionError("You have already upvoted this question.", 403);
    }

    throw error;
  }
}