import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtrasModule } from './modules/extras/extras.module';

const routes: Routes = [
  {
    path: '',
    loadChildren:() => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'more',
    loadChildren:() => import('./modules/extras/extras.module').then(m => ExtrasModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
