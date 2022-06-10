import { RouterModule, Routes } from '@angular/router';

import { ReportFormComponent } from './report-form/report-form.component'
import { NgModule } from '@angular/core';
import { ReportComponent } from './report.component'
import { ReportEntradaComponent } from './report-entrada/report-entrada.component'
const routes: Routes = [{
  path: '',
  component: ReportComponent,
  children: [
    {
      path: 'report-form',
      component: ReportFormComponent
    },
    {
      path: 'report-form/report-entrada/:id',
      component: ReportEntradaComponent
    },
    { path: '', redirectTo: 'report-form', pathMatch: 'full' },
    { path: '**', redirectTo: 'report-form', pathMatch: 'full' },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReportRoutingModule { }
