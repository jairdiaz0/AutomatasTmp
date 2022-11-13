import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeTextAreaComponent } from './code-text-area.component';

describe('CodeTextAreaComponent', () => {
  let component: CodeTextAreaComponent;
  let fixture: ComponentFixture<CodeTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodeTextAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
