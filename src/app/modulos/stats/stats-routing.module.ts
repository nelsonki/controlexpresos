import { RouterModule, Routes } from '@angular/router';

import { StatsTableComponent } from './stats-table/stats-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '' , component: StatsTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule { }
