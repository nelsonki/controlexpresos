import { RouterModule, Routes } from '@angular/router';

import { VehiclesTableComponent } from './vehicles-table/vehicles-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '', component: VehiclesTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }
