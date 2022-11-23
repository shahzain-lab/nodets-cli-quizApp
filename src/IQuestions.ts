
export interface IQuestionsResponse {
    results: IQuestionsResults[]
}

export interface IQuestionsResults     {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[]
  }

export interface IQuestionsTypes {
    questions: Number;
    level: string
}

export interface IQuestion {
    question: string
    correct: string
    category: string
    options: string[]
}