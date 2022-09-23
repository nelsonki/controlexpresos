import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinsTableComponent } from './coins-table/coins-table.component';

const routes: Routes = [{
  path: '', component: CoinsTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoinsRoutingModule { }
