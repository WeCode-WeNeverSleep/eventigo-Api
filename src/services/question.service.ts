import { Question, CreateQuestionDto, QuestionError } from "../types/Question.js";

const store = new Map<string, Question[]>(); 
const questionIndex = new Map<string, Question>();

function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getSessionQuestions(sessionId: string): Question[] {
  return store.get(sessionId) ?? [];
}

export function listQuestions(sessionId: string): Question[] {
  return [...getSessionQuestions(sessionId)].sort(
    (a, b) => b.upvotes - a.upvotes
  );
}

export function createQuestion(
  sessionId: string,
  dto: CreateQuestionDto,
  isLive: boolean 
): Question {
  if (!isLive) {
    throw new QuestionError(
      "Cannot post questions outside of Live hours.",
      403
    );
  }

  const question: Question = {
    id: generateId(),
    content: dto.content,
    authorName: dto.authorName ?? null,
    upvotes: 0,
    sessionId,
    createdAt: new Date().toISOString(),
  };

  store.set(sessionId, [...getSessionQuestions(sessionId), question]);
  questionIndex.set(question.id, question);

  return question;
}

export function upvoteQuestion(questionId: string): Question | null {
  const question = questionIndex.get(questionId);
  if (!question) return null;

  question.upvotes += 1;
  return question;
}
