import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnersTableComponent } from './partners-table/partners-table.component';

const routes: Routes = [{
  path: '', component: PartnersTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnersRoutingModule { }
