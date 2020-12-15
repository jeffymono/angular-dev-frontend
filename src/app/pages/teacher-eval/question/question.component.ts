import { Component, OnInit } from '@angular/core';
import { TeacherEvalService } from '../../../services/teacher-eval/teacher-eval.service';
import { Question } from '../../../models/teacher-eval/question';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreadcrumbService } from '../../../shared/breadcrumb.service';
import { EVALUATION_TYPES } from 'src/environments/catalogues';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  questions: Question[];
  colsQuestion: any[];
  formQuestion: FormGroup;
  displayFormQuestion: boolean;
  flagEditQuestion: boolean;
  selectedQuestion: Question;
  headerDialogQuestion: string;
  typeIdQuestion: SelectItem[];
  evaluationTypes: any[];
  types: any[];
  status: any[];

  constructor(private _teacherEvalService: TeacherEvalService,
    private _messageService: MessageService,
    private _fb: FormBuilder,
    private _translate: TranslateService,
    private _confirmationService: ConfirmationService,
    private _spinnerService: NgxSpinnerService,
    private _breadcrumbService: BreadcrumbService,
  ) {
    this._breadcrumbService.setItems([
      { label: 'questions' }
    ]);

    this.questions = [];
    this.buildFormQuestion();

  }

  ngOnInit(): void {

    this.evaluationTypes = [];
    this.types = [];
    this.status = [
      { label: '', value: '' }
    ];

    this.getQuestions();
    this.getEvaluationTypes();
    this.getCatalogueTypes();
    this.getTypeStatus();
    this.setColsQuestion();
  }

  setColsQuestion() {
    this._translate.stream('CODE').subscribe(response => {
      this.colsQuestion = [
        { field: 'code', header: this._translate.instant('CODE') },
        { field: 'order', header: this._translate.instant('ORDER') },
        { field: 'name', header: this._translate.instant('NAME') },
        { field: 'description', header: this._translate.instant('DESCRIPTION') },
        { field: 'evaluation_type.name', header: this._translate.instant('EVALUATION TYPE') },
        { field: 'type.name', header: this._translate.instant('TYPE') },
        { field: 'status.name', header: this._translate.instant('STATUS') },
      ];
    });
  }

  getEvaluationTypes(): void {
    this._spinnerService.show();
    this._teacherEvalService.get('evaluation_types').subscribe(
      response => {
        this.evaluationTypes = [{ label: 'Seleccione', value: '' }];
        response['data'].map((item: any) => {
          if (item.code == EVALUATION_TYPES.SELF_TEACHING || item.code == EVALUATION_TYPES.SELF_MANAGEMENT ||
              item.code == EVALUATION_TYPES.STUDENT_TEACHING || item.code == EVALUATION_TYPES.STUDENT_MANAGEMENT ||
              item.code == EVALUATION_TYPES.PAIR_TEACHING || item.code == EVALUATION_TYPES.PAIR_MANAGEMENT ||
              item.code == EVALUATION_TYPES.AUTHORITY_TEACHING || item.code == EVALUATION_TYPES.AUTHORITY_MANAGEMENT
            ) {
            this.evaluationTypes.push({ label: item.name, value: item.id });
          }
        })
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

  getCatalogueTypes(): void {
    const parameters = '?type=TYPE_QUESTIONS';
    this._teacherEvalService.get('catalogues' + parameters).subscribe(
      response => {
        const catalogueTypes = response['data'];
        this.types = [{ label: 'Seleccione', value: '' }];
        catalogueTypes.forEach(item => {
          this.types.push({ label: item.name, value: item.id });
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

  getTypeStatus(): void {
    const parameters = '?type=STATUS';
    this._teacherEvalService.get('catalogues' + parameters).subscribe(
      response => {
        const catalogueStatus = response['data'];
        this.status = [{ label: 'Seleccione', value: '' }];

        catalogueStatus.forEach(item => {
          this.status.push({ label: item.name, value: item.id });
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

  getStatusName(id: number) {
    const status = this.status.find(stat => stat.value === id)
    return status ? status.label : ""
  }

  getEvaluationTypeName(id: number) {
    const type = this.evaluationTypes.find(type => type.value === id)
    return type ? type.label : ""
  }

  getTypeName(id: number) {
    const type = this.types.find(type => type.value === id)
    return type ? type.label : ""
  }



  getQuestions() {
    this._spinnerService.show();
    this._teacherEvalService.get('questions').subscribe(
      response => {
        this._spinnerService.hide();
        this.questions = response['data'];
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

  buildFormQuestion() {
    this.formQuestion = this._fb.group({
      id: [''],
      code: ['', Validators.required],
      order: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      evaluation_type_id: ['', Validators.required],
      type_id: ['', Validators.required],
      status_id: ['', Validators.required],
    });
  }

  onSubmitQuestion(event: Event) {
    event.preventDefault();
    if (this.formQuestion.valid) {
      if (this.flagEditQuestion) {
        this.updateQuestion();
      } else {
        this.createQuestion();
      }
    } else {
      this.formQuestion.markAllAsTouched();
    }
  }

  selectQuestion(question: Question): void {
    if (question) {
      this.selectedQuestion = question;
      this.formQuestion.controls['id'].setValue(question.id);
      this.formQuestion.controls['code'].setValue(question.code);
      this.formQuestion.controls['order'].setValue(question.order);
      this.formQuestion.controls['name'].setValue(question.name);
      this.formQuestion.controls['description'].setValue(question.description);
      this.formQuestion.controls['evaluation_type_id'].setValue(question.evaluation_type.id);
      this.formQuestion.controls['type_id'].setValue(question.type.id);
      this.formQuestion.controls['status_id'].setValue(question.status.id);

    } else {
      this.selectedQuestion = {};
      this.formQuestion.reset();
    }
    this.displayFormQuestion = true;
  }

  createQuestion() {
    this.selectedQuestion = this.castQuestion();
    this._spinnerService.show();
    this._teacherEvalService.post('questions', {
      question: this.selectedQuestion,
      evaluation_type: this.selectedQuestion.evaluation_type,
      type: this.selectedQuestion.type,
      status: this.selectedQuestion.status,
    }).subscribe(
      response => {
        this.selectedQuestion.id = response['data']['id']
        this.questions.unshift(this.selectedQuestion);
        this._spinnerService.hide();
        this._messageService.add({
          key: 'tst',
          severity: 'success',
          summary: response['msg']['summary'],
          detail: response['msg']['detail'],
          life: 5000
        });
        this.displayFormQuestion = false;
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

  updateQuestion() {
    this.selectedQuestion = this.castQuestion();
    this._spinnerService.show();
    this._teacherEvalService.update('questions/' + this.selectedQuestion.id, {
      question: this.selectedQuestion,
      evaluation_type: this.selectedQuestion.evaluation_type,
      type: this.selectedQuestion.type,
      status: this.selectedQuestion.status,
    }).subscribe(
      response => {
        const indiceUser = this.questions
          .findIndex(element => element.id === this.selectedQuestion.id);
        this.questions.splice(indiceUser, 1, response['data']);
        this._spinnerService.hide();
        this._messageService.add({
          key: 'tst',
          severity: 'success',
          summary: response['msg']['summary'],
          detail: response['msg']['detail'],
          life: 5000
        });
        this.displayFormQuestion = false;
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

  deleteQuestion(question: Question) {
    this._confirmationService.confirm({
      header: 'Delete ' + question.name,
      message: 'Are you sure to delete?',
      acceptButtonStyleClass: 'ui-button-danger',
      rejectButtonStyleClass: 'ui-button-secondary',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      icon: 'pi pi-trash',
      accept: () => {
        this._spinnerService.show();
        this._teacherEvalService.delete('questions/' + question.id).subscribe(
          response => {
            const indiceUser = this.questions
              .findIndex(element => element.id === question.id);
            this.questions.splice(indiceUser, 1);
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
    });

  }

  castQuestion(): Question {
    return {
      id: this.formQuestion.controls['id'].value,
      code: this.formQuestion.controls['code'].value,
      order: this.formQuestion.controls['order'].value,
      name: this.formQuestion.controls['name'].value,
      description: this.formQuestion.controls['description'].value,
      evaluation_type: { id: this.formQuestion.controls['evaluation_type_id'].value },
      type: { id: this.formQuestion.controls['type_id'].value },
      status: { id: this.formQuestion.controls['status_id'].value },
    } as Question;
  }

}