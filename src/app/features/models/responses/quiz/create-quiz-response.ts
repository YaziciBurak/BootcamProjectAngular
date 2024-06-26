import { QuestionResponse } from "./question-response";


export interface CreateQuizResponse {
    id: number;
    applicantId: string;
    bootcampId: number;
    startTime: Date;
    endTime: Date;
    bootcampName: string;
    questionResponses: QuestionResponse[];
}
