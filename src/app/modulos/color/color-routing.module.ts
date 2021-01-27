import { RouterModule, Routes } from '@angular/router';

import {ColorTableComponent   } from './color-table/color-table.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '' , component: ColorTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColorRoutingModule { }
