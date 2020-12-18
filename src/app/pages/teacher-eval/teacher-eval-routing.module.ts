import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AnswerComponent} from './answer/answer.component';
import {QuestionComponent} from './question/question.component';
import {EvaluationTypeComponent} from './evaluation-type/evaluation-type.component';
import {EvaluationComponent} from './evaluation/evaluation.component';
import { SelfEvaluationComponent } from './self-evaluation/self-evaluation.component';
import { StudentEvaluationComponent } from './student-evaluation/student-evaluation.component';
import { EvaluationResultComponent } from './evaluation-result/evaluation-result.component';
import { PairEvaluationComponent } from './pair-evaluation/pair-evaluation.component';
import { AuthorityEvaluationComponent } from './authority-evaluation/authority-evaluation.component';
import {AttendanceComponent} from '../attendance/attendance/attendance.component';
import {AuthGuard} from '../../shared/auth.guard';
import {AdministrationComponent} from '../attendance/administration/administration.component';
import {BirthdayComponent} from '../attendance/birthday/birthday.component';


export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'evaluation-types',
        component: EvaluationTypeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'evaluations',
        component: EvaluationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'answers',
        component: AnswerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'questions',
        component: QuestionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        component: SelfEvaluationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'student-evaluations',
        component: StudentEvaluationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pair-evaluations',
        component: PairEvaluationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'authority-evaluations',
        component: AuthorityEvaluationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'evaluation-results',
        component: EvaluationResultComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherEvalRoutingModule { }

