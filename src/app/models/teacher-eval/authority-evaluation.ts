import { AnswerQuestion } from './answer-question';
import { DetailEvaluation } from '../teacher-eval/models.index'

export interface AuthorityEvaluation {
    id?: number;
    detail_evaluation?: DetailEvaluation;
    answer_questions?: AnswerQuestion[];
}