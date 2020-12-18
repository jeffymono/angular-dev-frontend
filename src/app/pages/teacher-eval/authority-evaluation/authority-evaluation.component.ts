import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../shared/breadcrumb.service';
import { MessageService } from 'primeng/api';
import { IgnugService } from '../../../services/ignug/ignug.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TeacherEvalService } from '../../../services/teacher-eval/teacher-eval.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthorityEvaluation } from 'src/app/models/teacher-eval/authority-evaluation';
import { EVALUATION_TYPES } from 'src/environments/catalogues';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-authority-evaluation',
  templateUrl: './authority-evaluation.component.html',
  styleUrls: ['./authority-evaluation.component.scss']
})
export class AuthorityEvaluationComponent implements OnInit {

  msgs: Message[];
  msgs2: Message[];
  status: any[];
  formAuthorityEvaluation: FormGroup;
  questionsTeaching: any[];
  questionsManagement: any[];
  authorityEvaluation: AuthorityEvaluation;
  selectedAuthorityEvaluation: AuthorityEvaluation;
  displayFormAuthorityEvaluation: boolean;
  displayVerificated: boolean;
  evaluatorTeaching: any[];
  evaluatorManagement: any[];
  teachers: any[];
  detailEvaluationTeachining: any[];
  detailEvaluationManagement: any[];
  listEvaluated: boolean;

  constructor(private _breadcrumbService: BreadcrumbService,
    private _fb: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _teacherEvalService: TeacherEvalService,
    private _messageService: MessageService,
    private _translate: TranslateService,
    private _ignugService: IgnugService,
  ) {
    this._breadcrumbService.setItems([
      { label: 'authorityEvaluations' }
    ]);

    this.detailEvaluationTeachining = [];
    this.detailEvaluationManagement = [];
    this.questionsTeaching = [];
    this.questionsManagement = [];
    
    this.buildformAuthorityEvaluation();

  }

  ngOnInit(): void {

    this.evaluatorTeaching = [];
    this.evaluatorManagement = [];
    this.teachers = [];
    this.msgs = [
      {
        severity: 'info',
        summary: 'Sin docentes a evaluar',
        detail: 'No constas como evaluador.'
      }
    ];
    this.msgs2 = [
      {
        severity: 'success',
        summary: 'Evaluación registrada',
        detail: 'La evaluación se ha registrado'
      }
    ];

    this.getQuestions();
    this.getEvaluators();
    this.getTeachers();

  }

  updateEvaluationAuthorityEvaluator() {
    this._spinnerService.hide();
    this._teacherEvalService.post('evaluations/authorities', {})
      .subscribe(
        response => {
          this._spinnerService.hide();
          this._messageService.add({
            key: 'tst',
            severity: 'success',
            summary: response['msg']['summary'],
            detail: response['msg']['detail'],
            life: 5000
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

  getTeachers(): void {
    this._spinnerService.show();
    this._ignugService.get('teachers').subscribe(
      response => {
        const teachers = response['data'];
        this.teachers = [{ label: 'Seleccione', value: '' }];
        teachers.map(item => {
          this.teachers.push({
            label: item.user.first_name + ' ' + item.user.second_name + ' ' +
              item.user.first_lastname + ' ' + item.user.second_lastname, value: item.user.id
          });
        });
      }, error => {
        this._messageService.add({
          key: 'tst',
          severity: 'error',
          summary: error.error.msg.summary,
          detail: error.error.msg.detail,
          life: 5000
        });
      });
  }
  
  getEvaluators(): void {
    this._teacherEvalService.get('detail_evaluations').subscribe(
      response => {
        if (response !== null) {
          this._spinnerService.hide();
          response['data'].map((item: any) => {
            if (item.evaluation.evaluation_type_id == EVALUATION_TYPES.AUTHORITY_TEACHING) {
              this.evaluatorTeaching.push({ id: item.id, evaluator: item.detail_evaluationable_id, evaluated: item.evaluation.teacher_id })
            } else if (item.evaluation.evaluation_type_id == EVALUATION_TYPES.AUTHORITY_MANAGEMENT) {
              this.evaluatorManagement.push({ id: item.id, evaluator: item.detail_evaluationable_id, evaluated: item.evaluation.teacher_id })
            }
          });
          if (this.evaluatorTeaching.length && this.evaluatorManagement.length) {
            this.listEvaluated = true;
          } else {
            this.displayVerificated = true;
          }
        } else {
          this.displayVerificated = true;
        }
      }, error => {
        this.displayVerificated = true;
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
 getQuestions(): void {
    this._spinnerService.show();
    this._teacherEvalService.get('types_questions/authorities').subscribe(
      response => {
        this._spinnerService.hide();
        response['data'].map(question => {
          if (question.evaluation_type_id == EVALUATION_TYPES.AUTHORITY_TEACHING) {
            this.questionsTeaching.push(question)
          } else if (question.evaluation_type_id == EVALUATION_TYPES.AUTHORITY_MANAGEMENT) {
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
          summary: 'Oops! Problemas con el servidor',
          //detail: error.error.msg.detail,
          life: 5000
        });
      });
  }

  getTeacherName(id: number) {
    const user = this.teachers.find(user => user.value === id)
    return user ? user.label : ""
  }

  selectEvaluation(event: any): void {
    this.detailEvaluationTeachining = event.id
    const detailManagement = this.evaluatorManagement.find(id => id.evaluated === event.evaluated)
    this.detailEvaluationManagement = detailManagement.id
  }
  
  return() {
    const indiceUser = this.evaluatorTeaching
      .findIndex(element => element.id === this.detailEvaluationTeachining);
    this.evaluatorTeaching.splice(indiceUser, 1);
    if (this.evaluatorTeaching.length) {
      this.listEvaluated = true
    } else {
      this.getEvaluators()
    }
  }

  buildformAuthorityEvaluation() {
    this.formAuthorityEvaluation = this._fb.group({
      id: [''],
      detail_evaluation_id: [''],
      teachingArray: new FormArray([]),
      managementArray: new FormArray([])
    });
  }
  get teachingArray() {
    return this.formAuthorityEvaluation.get('teachingArray') as FormArray;
  }
  get managementArray() {
    return this.formAuthorityEvaluation.get('managementArray') as FormArray;
  }
  onSubmitAuthorityEvaluation(event: Event) {
    event.preventDefault();
    if (this.formAuthorityEvaluation.valid) {
      this.createAuthorityEvaluationTeaching();
      this.createAuthorityEvaluationManagement();

    } else {
      this.formAuthorityEvaluation.markAllAsTouched();
    }

  }

  createAuthorityEvaluationTeaching() {
   this.selectedAuthorityEvaluation = this.castAuthorityEvaluationTeaching();
    this._spinnerService.show();
    this._teacherEvalService.post('pair_evaluations/authorities', {
      detail_evaluation: { id: this.selectedAuthorityEvaluation.detail_evaluation },
      answer_questions: this.selectedAuthorityEvaluation.answer_questions
    }).subscribe(
      response => {
        this._spinnerService.show();
        this.formAuthorityEvaluation.reset();
        this._messageService.add({
          key: 'tst',
          severity: 'success',
          summary: response['msg']['summary'],
          detail: response['msg']['detail'],
          life: 5000
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
  createAuthorityEvaluationManagement() {
    this.selectedAuthorityEvaluation = this.castAuthorityEvaluationManagement();
    this._spinnerService.show();
    this._teacherEvalService.post('pair_evaluations/authorities', {
      detail_evaluation: { id: this.selectedAuthorityEvaluation.detail_evaluation },
      answer_questions: this.selectedAuthorityEvaluation.answer_questions
    }).subscribe(
      response => {
        this._spinnerService.show();
        this.displayFormAuthorityEvaluation = false;
        this.formAuthorityEvaluation.reset();
        this.updateEvaluationAuthorityEvaluator();
        this.return();
        this._spinnerService.show()
        this._messageService.add({
          key: 'tst',
          severity: 'success',
          summary: response['msg']['summary'],
          detail: response['msg']['detail'],
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

  castAuthorityEvaluationTeaching(): AuthorityEvaluation {
    return {
      id: this.formAuthorityEvaluation.controls['id'].value,
      detail_evaluation: this.detailEvaluationTeachining,
      answer_questions: this.formAuthorityEvaluation.controls['teachingArray'].value.map((answer_question_id: any) => {
        return { id: answer_question_id }
      }),

    } as AuthorityEvaluation;
  }
  castAuthorityEvaluationManagement(): AuthorityEvaluation {
    return {
      id: this.formAuthorityEvaluation.controls['id'].value,
      detail_evaluation: this.detailEvaluationManagement,
      answer_questions: this.formAuthorityEvaluation.controls['managementArray'].value.map((answer_question_id: any) => {
        return { id: answer_question_id }
      }),

    } as AuthorityEvaluation;
  }

}
