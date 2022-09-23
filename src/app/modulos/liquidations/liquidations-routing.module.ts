import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidationsTableComponent } from './liquidations-table/liquidations-table.component';

const routes: Routes = [{
  path: '', component: LiquidationsTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidationsRoutingModule { }
