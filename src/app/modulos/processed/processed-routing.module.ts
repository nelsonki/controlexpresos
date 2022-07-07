import { RouterModule, Routes } from '@angular/router';

import { ProcessedTableComponent } from './processed-table/processed-table.component';
import { NgModule } from '@angular/core';
import { ProcessedComponent } from './processed.component'
const routes: Routes = [{
  path: '', component: ProcessedComponent,
  children: [
    {
      path: 'Procesadas',
      component: ProcessedTableComponent
    },
    {
      path: 'Procesadas/:id',
      component: ProcessedTableComponent
    },
    { path: '', redirectTo: 'Procesadas', pathMatch: 'full' },
    { path: '**', redirectTo: 'Procesadas', pathMatch: 'full' },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessedRoutingModule { }
