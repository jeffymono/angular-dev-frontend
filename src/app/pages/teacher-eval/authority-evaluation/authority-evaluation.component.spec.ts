import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityEvaluationComponent } from './authority-evaluation.component';

describe('AuthorityEvaluationComponent', () => {
  let component: AuthorityEvaluationComponent;
  let fixture: ComponentFixture<AuthorityEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorityEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
