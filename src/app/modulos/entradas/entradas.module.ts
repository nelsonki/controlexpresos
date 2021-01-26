import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradasTableComponent } from './entradas-table/entradas-table.component';
import {EntradasRoutingModule} from './entradas-routing.module'


@NgModule({
  declarations: [EntradasTableComponent],
  imports: [
    CommonModule,
    EntradasRoutingModule
  ]
})
export class EntradasModule { }
