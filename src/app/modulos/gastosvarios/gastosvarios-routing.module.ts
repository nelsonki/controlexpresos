import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GastosvariosTableComponent } from './gastosvarios-table/gastosvarios-table.component';

const routes: Routes = [{
  path: '', component: GastosvariosTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastosvariosRoutingModule { }
