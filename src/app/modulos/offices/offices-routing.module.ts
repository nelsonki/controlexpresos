import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficesTableComponent } from './offices-table/offices-table.component';

const routes: Routes = [{
  path: '', component: OfficesTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficesRoutingModule { }
