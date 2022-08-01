import { RouterModule, Routes } from '@angular/router';

import { ProcessedTableComponent } from './processed-table/processed-table.component';
import { NgModule } from '@angular/core';
import { ProcessedComponent } from './processed.component'
import { ReportFormComponent } from './../report/report-form/report-form.component'

const routes: Routes = [{
  path: '', component: ProcessedComponent,
  children: [
    /*{
      path: 'Procesadas',
      component: ProcessedTableComponent
    } 
    {
      path: 'Procesadas/:id',
      component: ProcessedTableComponent
    },*/
    {
      path: 'report-form',
      component: ReportFormComponent
    },
    {
      path: 'Procesadas/:id/:fecha',
      component: ProcessedTableComponent
    },
    { path: '', redirectTo: 'report-form', pathMatch: 'full' },
    { path: '**', redirectTo: 'report-form', pathMatch: 'full' },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessedRoutingModule { }
