import { Component, OnInit } from '@angular/core';
import { TeacherEvalService } from '../../../services/teacher-eval/teacher-eval.service';
import { BreadcrumbService } from '../../../shared/breadcrumb.service';
import { IgnugService } from '../../../services/ignug/ignug.service';
import { Evaluation } from '../../../models/teacher-eval/evaluation';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EVALUATION_TYPES } from 'src/environments/catalogues';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
  evaluations: Evaluation[];
  colsEvaluation: any[];
  formEvaluation: FormGroup;
  displayFormEvaluation: boolean;
  flagEditEvaluation: boolean;
  flagCreateDetailEvaluation: boolean;
  selectedEvaluation: Evaluation;
  headerDialogEvaluation: string;
  typeIdEvaluation: SelectItem[];
  evaluationTypes: any[];
  teachers: any[];
  selectedEvaluators: any[];
  detailSelected: any[];
  status: any[];
  schoolPeriods: any[];
  selectedEvaluationType: number;
  filteredTeachers: any[];

  constructor(private _teacherEvalService: TeacherEvalService,
    private _ignugService: IgnugService,
    private _messageService: MessageService,
    private _fb: FormBuilder,
    private _translate: TranslateService,
    private _confirmationService: ConfirmationService,
    private _spinnerService: NgxSpinnerService,
    private _breadcrumbService: BreadcrumbService,
  ) {
    this._breadcrumbService.setItems([
      { label: 'evaluations' }
    ]);

    this.evaluations = [];
    this.buildFormEvaluation();
  }


  ngOnInit(): void {

    this.evaluationTypes = [];
    this.teachers = [];
    this.filteredTeachers = [];
    this.schoolPeriods = [];
    this.selectedEvaluators = [];
    this.detailSelected = [];
    this.status = [
      { label: '', value: '' }
    ];

    this.getEvaluations();
    this.getEvaluationTypes();
    this.getTeachers();
    this.getTypeStatus();
    this.setColsEvaluation();

  }

  filterTeachers(event): void {
    this.filteredTeachers = [];
    for (let i = 0; i < this.teachers.length; i++) {
      let teacher = this.teachers[i];
      if (teacher.label.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredTeachers.push(teacher);
      }
    }
  }

  selectAddEvaluator(event) {
    let search = this.selectedEvaluators.find(item => item.id === event.value)
    return !search ? this.selectedEvaluators.push({ id: event.value }) : ''
  }

  selectDeleteEvaluator($event) {
    let result = this.selectedEvaluators.find(item => item.id === $event.value)
    let position = this.selectedEvaluators.indexOf(result);
    return position > -1 ? this.selectedEvaluators.splice(position, 1) : 'ID not found'
  }

  getPercentage($event) {
    let id = $event.value;

    const percentage = this.evaluationTypes.find(percentage => percentage.value === id)
    this.selectedEvaluationType = percentage['percentage'];
  }

  getResult(result){
    let total = result*100/4
    return total.toFixed(2)
  }

  setColsEvaluation() {
    this._translate.stream('CODE').subscribe(response => {
      this.colsEvaluation = [
        { field: 'teacher.name', header: this._translate.instant('TEACHER') },
        { field: 'evaluation_type.name', header: this._translate.instant('EVALUATION TYPE') },
        { field: 'percentage', header: this._translate.instant('PERCENTAGE') },
        { field: 'school_period.name', header: this._translate.instant('SCHOOL PERIOD') },
        { field: 'result', header: this._translate.instant('RESULT') },
        { field: 'status.name', header: this._translate.instant('STATUS') },
        { field: 'evaluators', header: this._translate.instant('EVALUETORS') },

      ];
    });
  }

  getEvaluations() {
    this._spinnerService.show();
    this._teacherEvalService.get('evaluations').subscribe(
      response => {
        this._spinnerService.hide();
        this.evaluations = response['data'];
        /*this.schoolPeriods = [{ label: 'Seleccione', value: '' }];
        this.evaluations.map(item => {
          this.schoolPeriods.push({
            label: item.school_period.name + ' ' + item.school_period.start_date + ' - ' +
              item.school_period.start_date, value: item.school_period.id
          });
        });*/
        this._messageService.add({
          key: 'tst',
          severity: 'success',
          summary: response['msg']['summary'],
          detail: response['msg']['detail'],
          life: 5000
        });
        /*let hash = {};
        let newSchoolPeriods = this.schoolPeriods.filter(o => hash[o.value] ? false : hash[o.value] = true);
        this.newSchoolPeriods = newSchoolPeriods
        console.log(response);*/
        console.log(response)
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

  getEvaluationTypes(): void {
    this._spinnerService.show();
    this._teacherEvalService.get('evaluation_types').subscribe(
      response => {
        this.evaluationTypes = [{ label: 'Seleccione', value: '' }];
        response['data'].map((item: any) => {
          if (item.code == EVALUATION_TYPES.PAIR_TEACHING || item.code == EVALUATION_TYPES.PAIR_MANAGEMENT) {
            this.evaluationTypes.push({ label: item.name, value: item.id, percentage: item.percentage });
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

  getSchoolPeriods(): void {

  }

  getStatusName(id: number) {
    const status = this.status.find(stat => stat.value === id)
    return status ? status.label : ""
  }

  getEvaluationTypeName(id: number) {
    const type = this.evaluationTypes.find(type => type.value === id)
    return type ? type.label : ""
  }

  getTeacherName(id: number) {
    const user = this.teachers.find(user => user.value === id)
    return user ? user.label : ""
  }

  getNameSchoolPeriod(id: number) {
    const school = this.schoolPeriods.find(school => school.value === id)
    return school ? school.label : ''
  }

  buildFormEvaluation() {
    this.formEvaluation = this._fb.group({
      id: [''],
      teacher_id: ['', Validators.required],
      evaluation_type_id: ['', Validators.required],
      //school_period_id: ['', Validators.required],
      percentage: [''],
      result: [''],
      status_id: ['', Validators.required],
      evaluators: [''],

    });
  }

  onSubmitEvaluation(event: Event) {
    event.preventDefault();
    if (this.formEvaluation.valid) {
      if (this.flagEditEvaluation) {
        this.updateEvaluation();
      } else if (this.flagCreateDetailEvaluation) {
        this.createDetailEvaluation();
      } else {
        this.createEvaluation();
      }
    } else {
      this.formEvaluation.markAllAsTouched();
    }
  }

  selectEvaluation(evaluation: Evaluation): void {
    if (evaluation) {
      this.selectedEvaluation = evaluation;
      this.formEvaluation.controls['id'].setValue(evaluation.id);
      this.formEvaluation.controls['teacher_id'].setValue(evaluation.teacher.id);
      this.formEvaluation.controls['evaluation_type_id'].setValue(evaluation.evaluation_type.id);
      //this.formEvaluation.controls['school_period_id'].setValue(evaluation.school_period.id);
      this.formEvaluation.controls['percentage'].setValue(evaluation.percentage);
      this.formEvaluation.controls['status_id'].setValue(evaluation.status.id);
      /*this.formEvaluation.controls['evaluators'].setValue(evaluation.detail_evaluations.map((item : any)=>{
        return { id : item.detail_evaluationable_type}
      }));*/
    } else {
      this.selectedEvaluation = {};
      this.formEvaluation.reset();
    }
    this.displayFormEvaluation = true;

  }

  createEvaluation() {
    this.selectedEvaluation = this.castEvaluation();
    this._spinnerService.show();
    this._teacherEvalService.post('evaluations', {
      evaluation: this.selectedEvaluation,
      teacher: this.selectedEvaluation.teacher,
      evaluation_type: this.selectedEvaluation.evaluation_type,
      //school_period: this.selectedEvaluation.school_period,
      status: this.selectedEvaluation.status,
    }).subscribe(
      response => {
        this.selectedEvaluation.id = response['data']['id']
        this.evaluations.unshift(this.selectedEvaluation);
        this._spinnerService.hide();
        this._messageService.add({
          key: 'tst',
          severity: 'success',
          summary: response['msg']['summary'],
          detail: response['msg']['detail'],
          life: 5000
        });
        this.displayFormEvaluation = false;
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

  createDetailEvaluation() {
    this.selectedEvaluation = this.castEvaluation();
    this._spinnerService.show();
    this._teacherEvalService.post('detail_evaluations', {
      evaluation: { id: this.selectedEvaluation.id },
      evaluators: this.selectedEvaluators,
    }).subscribe(
      response => {
        this._spinnerService.hide();
        this.formEvaluation.reset();
        this.selectedEvaluators = [];
          this.getEvaluations()
            this._spinnerService.hide();
        this._messageService.add({
          key: 'tst',
          severity: 'success',
          summary: response['msg']['summary'],
          detail: response['msg']['detail'],
          life: 5000
        });
        this.displayFormEvaluation = false;
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

  updateEvaluation() {
    this.selectedEvaluation = this.castEvaluation();
    this._spinnerService.show();
    this._teacherEvalService.update('evaluations/' + this.selectedEvaluation.id, {
      evaluation: this.selectedEvaluation,
      teacher: this.selectedEvaluation.teacher,
      evaluation_type: this.selectedEvaluation.evaluation_type,
      //school_period: this.selectedEvaluation.school_period,
      evaluators: this.selectedEvaluators,
      status: this.selectedEvaluation.status,
    }).subscribe(
      response => {
        this._spinnerService.hide();
        this.formEvaluation.reset();
        this._messageService.add({
          key: 'tst',
          severity: 'success',
          summary: response['msg']['summary'],
          detail: response['msg']['detail'],
          life: 5000
        });
        this.displayFormEvaluation = false;
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

  deleteEvaluation(evaluation: Evaluation) {
    this._confirmationService.confirm({
      header: 'Delete ' + evaluation.id,
      message: 'Are you sure to delete?',
      acceptButtonStyleClass: 'ui-button-danger',
      rejectButtonStyleClass: 'ui-button-secondary',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      icon: 'pi pi-trash',
      accept: () => {
        this._spinnerService.show();
        this._teacherEvalService.delete('evaluations/' + evaluation.id).subscribe(
          response => {
            const indiceUser = this.evaluations
              .findIndex(element => element.id === evaluation.id);
            this.evaluations.splice(indiceUser, 1);
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

  castEvaluation(): Evaluation {
    return {
      id: this.formEvaluation.controls['id'].value,
      teacher: { id: this.formEvaluation.controls['teacher_id'].value },
      evaluation_type: { id: this.formEvaluation.controls['evaluation_type_id'].value },
      //school_period: { id: this.formEvaluation.controls['school_period_id'].value },
      percentage: this.selectedEvaluationType,
      result: this.formEvaluation.controls['result'].value,
      evaluators: [{ id: this.formEvaluation.controls['evaluators'].value }],
      status: { id: this.formEvaluation.controls['status_id'].value },
    } as Evaluation;
  }

}
