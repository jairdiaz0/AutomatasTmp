import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeTextAreaComponent } from './components/code-text-area/code-text-area.component';
import { ConsoleTextAreaComponent } from './components/console-text-area/console-text-area.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CodeTextAreaComponent,
    ConsoleTextAreaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    CodeTextAreaComponent,
    ConsoleTextAreaComponent
  ]
})
export class SharedModule { }
