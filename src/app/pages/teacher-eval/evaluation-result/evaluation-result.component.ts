import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../shared/breadcrumb.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { TeacherEvalService } from '../../../services/teacher-eval/teacher-eval.service';
import { TranslateService } from '@ngx-translate/core';
import { Evaluation } from 'src/app/models/teacher-eval/evaluation';
@Component({
  selector: 'app-evaluation-result',
  templateUrl: './evaluation-result.component.html',
  styleUrls: ['./evaluation-result.component.scss']
})
export class EvaluationResultComponent implements OnInit {

  evaluations: any[];
  colsEvaluationResult: any[];
  userLogged: number;

  constructor(private _breadcrumbService: BreadcrumbService,
    private _spinnerService: NgxSpinnerService,
    private _teacherEvalService: TeacherEvalService,
    private _messageService: MessageService,
    private _translate: TranslateService,
  ) {
    this._breadcrumbService.setItems([
      { label: 'evaluationResults' }
    ]);
    this.evaluations = []
  }

  ngOnInit(): void {

    this.userLogged = JSON.parse(localStorage.getItem('user')).id;
    this.setColsEvaluationResult();
    this.getEvaluations();

  }
  setColsEvaluationResult() {
    this._translate.stream('CODE').subscribe(response => {
      this.colsEvaluationResult = [
        { field: 'evaluation_type', header: this._translate.instant('EVALUATION TYPE') },
        { field: 'school_period', header: this._translate.instant('SCHOOL PERIOD') },
        { field: 'result', header: this._translate.instant('RESULT') },
      ];
    });
  }

  getResultFinal(result:any){
    const resultFinal = result*100/4;

    return resultFinal.toFixed(2);
  }

  getEvaluations(): void {
    this._spinnerService.show();
    this._teacherEvalService.get('evaluations/teacher_evaluations').subscribe(
      response => {
        this._spinnerService.hide();
        this.evaluations = response['data']
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
      }
    );
  }

}
