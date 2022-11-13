import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleTextAreaComponent } from './console-text-area.component';

describe('ConsoleTextAreaComponent', () => {
  let component: ConsoleTextAreaComponent;
  let fixture: ComponentFixture<ConsoleTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsoleTextAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
