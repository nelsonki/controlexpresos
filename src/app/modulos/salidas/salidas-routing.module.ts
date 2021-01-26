import { RouterModule, Routes } from '@angular/router';

import { SalidasTableComponent } from './salidas-table/salidas-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '' , component: SalidasTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidasRoutingModule { }
