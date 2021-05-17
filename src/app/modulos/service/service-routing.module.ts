import { RouterModule, Routes } from '@angular/router';

import {ServiceTableComponent   } from './service-table/service-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '' , component: ServiceTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
