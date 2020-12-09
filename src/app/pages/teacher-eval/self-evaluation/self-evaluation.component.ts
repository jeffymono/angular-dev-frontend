import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../shared/breadcrumb.service';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TeacherEvalService } from '../../../services/teacher-eval/teacher-eval.service';
import { TranslateService } from '@ngx-translate/core';
import { SelfEvaluation } from 'src/app/models/teacher-eval/self-evaluation';
import { EVALUATION_TYPES } from 'src/environments/catalogues';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';


@Component({
    selector: 'app-self-evaluation',
    templateUrl: './self-evaluation.component.html',
    styleUrls: ['./self-evaluation.component.scss']
})
export class SelfEvaluationComponent implements OnInit {

    formSelfEvaluation: FormGroup;
    questions: any[];
    selfEvaluation: SelfEvaluation;
    selectedSelfEvaluation: SelfEvaluation;
    displayFormSelEvaluation: boolean;
    showSelfEvaluation: boolean;

    constructor(private _breadcrumbService: BreadcrumbService,
        private _fb: FormBuilder,
        private _spinnerService: NgxSpinnerService,
        private _teacherEvalService: TeacherEvalService,
        private _messageService: MessageService,
        private _translate: TranslateService,
        private _router: Router
    ) {
        this._breadcrumbService.setItems([
            { label: 'selfEvaluations' }
        ]);

        this.questions = [];

        this.buildformSelfEvaluation();

    }

    ngOnInit(): void {
        this.getEvaluations();
        this.getQuestions();

    }

    getQuestions(): void {
        this._spinnerService.show();
        this.displayFormSelEvaluation = false;
        this._teacherEvalService.get('types_questions/self_evaluations').subscribe(
            response => {
                this._spinnerService.hide();
                this.displayFormSelEvaluation = true;

                this.questions = response['data']

                this.questions.map(question => {
                    this.answerQuestionsArray.push(new FormControl("", Validators.required));
                })
                /*                 this._messageService.add({
                                    key: 'tst',
                                    severity: 'success',
                                    summary: response['msg']['summary'],
                                    detail:  response['msg']['detail'],
                                    life: 3000
                                  }); */
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

    showEvaluationResult(): void {
        this._router.navigate(['/teacher_eval/evaluation-results'])
    }

    getEvaluations(): void {
        this._spinnerService.show();
        this._teacherEvalService.get('evaluations/registered_self_evaluations').subscribe(
            response => {
                this._spinnerService.hide();
                this.showEvaluationResult()
                this.showSelfEvaluation = false

            }, error => {
                this._spinnerService.hide();
                this.showSelfEvaluation = true
            });
    }

    buildformSelfEvaluation() {
        this.formSelfEvaluation = this._fb.group({
            id: [''],
            answerQuestionsArray: new FormArray([]),
        });
    }

    get answerQuestionsArray() {
        return this.formSelfEvaluation.get('answerQuestionsArray') as FormArray;
    }

    onSubmitSelfEvaluation(event: Event) {
        event.preventDefault();
        if (this.formSelfEvaluation.valid) {
            this.createSelfEvaluation();
        } else {
            this.formSelfEvaluation.markAllAsTouched();
        }
    }

    createSelfEvaluation() {

        this.selectedSelfEvaluation = this.castSelfEvaluation();
        this._spinnerService.show();
        this._teacherEvalService.post('self_evaluations', {
            answer_questions: this.selectedSelfEvaluation.answer_questions

        }).subscribe(
            response => {
                this._spinnerService.hide();
                this.formSelfEvaluation.reset();
                this.showEvaluationResult()
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

    castSelfEvaluation(): SelfEvaluation {
        return {
            id: this.formSelfEvaluation.controls['id'].value,
            answer_questions: this.formSelfEvaluation.controls['answerQuestionsArray'].value.map((answer_question_id: any) => {
                return { id: answer_question_id }
            }),

        } as SelfEvaluation;
    }

}
