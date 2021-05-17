import { RouterModule, Routes } from '@angular/router';

import { ProcessedTableComponent } from './processed-table/processed-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '' , component: ProcessedTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessedRoutingModule { }
