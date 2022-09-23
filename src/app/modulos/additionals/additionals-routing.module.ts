import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddtionalsTableComponent } from './addtionals-table/addtionals-table.component';

const routes: Routes = [{
  path: '', component: AddtionalsTableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionalsRoutingModule { }
