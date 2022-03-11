import { RouterModule, Routes } from '@angular/router';

import { IndicadoresTableComponent } from './indicadores-table/indicadores-table.component'
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '', component: IndicadoresTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicadoresRoutingModule { }
