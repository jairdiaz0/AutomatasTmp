import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtrasRoutingModule } from './extras-routing.module';
import { ExtraComponent } from './extra/extra.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ExtraComponent
  ],
  imports: [
    CommonModule,
    ExtrasRoutingModule,
    SharedModule
  ]
})
export class ExtrasModule { }
