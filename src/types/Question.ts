export interface Question {
  id: string;
  content: string;
  authorName?: string | null; 
  upvotes: number;            
  sessionId: string;
  createdAt: string;          
}


export interface CreateQuestionDto {
  content: string;
  authorName?: string;
}

export class QuestionError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "QuestionError";
  }
}
