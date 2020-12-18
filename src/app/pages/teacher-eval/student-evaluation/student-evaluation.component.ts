import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../shared/breadcrumb.service';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TeacherEvalService } from '../../../services/teacher-eval/teacher-eval.service';
import { TranslateService } from '@ngx-translate/core';
import { EVALUATION_TYPES } from 'src/environments/catalogues';
import { StudentEvaluation} from '../../../models/teacher-eval/student-evaluation';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-evaluation',
  templateUrl: './student-evaluation.component.html',
  styleUrls: ['./student-evaluation.component.css']
})
export class StudentEvaluationComponent implements OnInit {

  status: any[];
  formStudentEvaluation: FormGroup;
  questionsTeaching: any[];
  questionsManagement: any[];
  studentEvaluation: StudentEvaluation;
  selectedStudentEvaluation: StudentEvaluation;
  displayFormStudentEvaluation: boolean;
  showStudentEvaluation: boolean;
  

  constructor(private _breadcrumbService: BreadcrumbService,
    private _fb: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _teacherEvalService: TeacherEvalService,
    private _messageService: MessageService,
    private _translate: TranslateService,
    private _router: Router)

    { 
      this._breadcrumbService.setItems([
        { label: 'studentEvaluations' }
      ]);
      this.questionsTeaching = [];
      this.questionsManagement = [];
      this.buildformStudentEvaluation();

    }

  ngOnInit(): void 
  { 
    this.getEvaluations();
    this.getQuestions();

  }
  getQuestions(): void {
    this._spinnerService.show();
    this.displayFormStudentEvaluation = false;
    this._teacherEvalService.get('types_questions/student_evaluations').subscribe(
        response => {
            this._spinnerService.hide();
            this.displayFormStudentEvaluation = true;

            response['data'].map(question => {
                if (question.evaluation_type_id == EVALUATION_TYPES.STUDENT_TEACHING) {
                    this.questionsTeaching.push(question)
                } else if (question.evaluation_type_id == EVALUATION_TYPES.STUDENT_MANAGEMENT) {
                    this.questionsManagement.push(question)
                }
            })

            this.questionsTeaching.map(question => {
                this.teachingArray.push(new FormControl("", Validators.required));
            })

            this.questionsManagement.map(question => {
                this.managementArray.push(new FormControl("", Validators.required));
            })

        }, error => {
            this._spinnerService.hide();
            this._messageService.add({
                key: 'tst',
                severity: 'error',
                summary: error.error.msg.summary,
                detail:  error.error.msg.detail,
                life: 5000
            });
        });
}
showEvaluationResult(): void {
    this._router.navigate(['/teacher_eval/evaluation-results'])
}
getEvaluations(): void {
    this._spinnerService.show();
    this._teacherEvalService.get('evaluations/registered_student_evaluations').subscribe(
        response => {
            this.selectedStudentEvaluation.subject_teacher,
            this._spinnerService.hide();
            this.showEvaluationResult()
            this.showStudentEvaluation = false

        }, error => {
            this._spinnerService.hide();
            this.showStudentEvaluation = true
        });
}

buildformStudentEvaluation() {
      this.formStudentEvaluation = this._fb.group({
          id: [''],
          student_id: ['', Validators.required],
          subject_teacher_id: ['', Validators.required],
          teachingArray: new FormArray([]),
          managementArray: new FormArray([])
      });
  }
  get teachingArray() {
      return this.formStudentEvaluation.get('teachingArray') as FormArray;
  }
  get managementArray() {
      return this.formStudentEvaluation.get('managementArray') as FormArray;
  }

  onSubmitStudentEvaluation(event: Event) {
    event.preventDefault();
    if (this.formStudentEvaluation.valid) {
        this.createStudentEvaluationTeaching();
        this.createStudentEvaluationManagement();

    } else {
        this.formStudentEvaluation.markAllAsTouched();
    }

    }   
createStudentEvaluationTeaching() {
  this.selectedStudentEvaluation = this.castStudentEvaluationTeaching();
  this._spinnerService.show();
  this._teacherEvalService.post('student_evaluations', {
      subject_teacher: this.selectedStudentEvaluation.subject_teacher,
      student: this.selectedStudentEvaluation.student,
      answer_questions: this.selectedStudentEvaluation.answer_questions
  }).subscribe(
      response => {
          this._spinnerService.hide();
          this.formStudentEvaluation.reset();
          this._messageService.add({
              key: 'tst',
              severity: 'success',
              summary: response['msg']['summary'],
              detail:  response['msg']['detail'],
              life: 3000
          });
      }, error => {
          this._spinnerService.hide();
          this._messageService.add({
              key: 'tst',
              severity: 'error',
              summary: error.error.msg.summary,
              detail:  error.error.msg.detail,
              life: 5000
          });
      });
}
createStudentEvaluationManagement() {
  this.selectedStudentEvaluation = this.castStudentEvaluationManagement();
  this._spinnerService.show();
  console.log('usuario',this.selectedStudentEvaluation.student);
  this._teacherEvalService.post('student_evaluations', {
      subject_teacher: this.selectedStudentEvaluation.subject_teacher,
      student: this.selectedStudentEvaluation.student,
      answer_questions: this.selectedStudentEvaluation.answer_questions
      
  }).subscribe(
      response => {
        this._spinnerService.hide();
          this.formStudentEvaluation.reset();
          this._messageService.add({
              key: 'tst',
              severity: 'success',
              summary: response['msg']['summary'],
              detail:  response['msg']['detail'],
              life: 3000
          });
      }, error => {
          this._spinnerService.hide();
          this._messageService.add({
              key: 'tst',
              severity: 'error',
              summary: error.error.msg.summary,
              detail: error.error.msg.detail,
              life: 5000
          });
      });
}
castStudentEvaluationTeaching(): StudentEvaluation {
  return {
      id: this.formStudentEvaluation.controls['id'].value,
      subject_teacher: { id: this.formStudentEvaluation.controls['subject_teacher_id'].value },
      student: { id: this.formStudentEvaluation.controls['student_id'].value },
      answer_questions: this.formStudentEvaluation.controls['teachingArray'].value.map((answer_question_id: any) => {
          return { id: answer_question_id }
      }),

} as StudentEvaluation;
}
castStudentEvaluationManagement(): StudentEvaluation {
  return {
      id: this.formStudentEvaluation.controls['id'].value,
      subject_teacher: { id: this.formStudentEvaluation.controls['subject_teacher_id'].value },
      student: { id: this.formStudentEvaluation.controls['student_id'].value },
      answer_questions: this.formStudentEvaluation.controls['managementArray'].value.map((answer_question_id: any) => {
          return { id: answer_question_id }
      }),

  } as StudentEvaluation;
}
}
