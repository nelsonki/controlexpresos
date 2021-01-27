import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalidasTableComponent } from './salidas-table/salidas-table.component';
import {SalidasRoutingModule} from './salidas-routing.module'


@NgModule({
  declarations: [SalidasTableComponent],
  imports: [
    CommonModule,
    SalidasRoutingModule
  ]
})
export class SalidasModule { }
