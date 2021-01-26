import { RouterModule, Routes } from '@angular/router';

import { EntradasTableComponent } from './entradas-table/entradas-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '' , component: EntradasTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntradasRoutingModule { }
