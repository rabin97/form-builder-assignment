export interface FormType {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    categories: CategoryType[];
    fillInBlanks: FillInBlank[];
    paragraph: ParagraphType[];
}

export interface CategoryType {
    id: string;
    name: string;
    formId: string;
    answers: Answer[];
}

export interface Answer {
    id: string;
    text: string;
    categoryId?: string; // Optional because it's not present in fillInBlanks
    fillInTheBlankId?: string; // Optional because it's used in FillInBlanks
    mcqQuestionId?: string; // Optional because it's used in Paragraph questions
    isCorrect?: boolean | null; // Optional for MCQ answers
}

export interface FillInBlank {
    id: string;
    content: string;
    formId: string;
    answers: Answer[];
}

export interface ParagraphType {
    id: string;
    content: string;
    formId: string;
    questions: ParagraphQuestion[];
}

export interface ParagraphQuestion {
    id: string;
    question: string;
    correctAnswer: string;
    paragraphId: string;
    answers: Answer[];
}
