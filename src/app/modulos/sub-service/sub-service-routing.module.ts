import { RouterModule, Routes } from '@angular/router';

import {SubServiceTableComponent   } from './sub-service-table/sub-service-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '' , component: SubServiceTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubServiceRoutingModule { }
