import { RouterModule, Routes } from '@angular/router';

import {ClientTableComponent   } from './client-table/client-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '' , component: ClientTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
