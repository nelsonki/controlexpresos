import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { LiquidationsTableComponent } from './liquidations-table/liquidations-table.component';
import { LiquidationsFormComponent } from './liquidations-form/liquidations-form.component';
import { LiquidationsDeleteComponent } from './dialog/liquidations-delete/liquidations-delete.component';
import {LiquidationsRoutingModule} from './liquidations-routing.module'

import { ModalModule, ButtonsModule, WavesModule } from 'angular-bootstrap-md';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { MatSelectModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from '../../material.module';
import { DateRangeComponent } from './date-range/date-range.component';
import { NgxMatDrpModule } from './date-range/modules/ngx-mat-drp/ngx-mat-drp.module';
import { LiquidationsGastosComponent } from './dialog/liquidations-gastos/liquidations-gastos.component';
import { LiquidationsViajeComponent } from './dialog/liquidations-viaje/liquidations-viaje.component';

@NgModule({
  declarations: [LiquidationsTableComponent, LiquidationsFormComponent, LiquidationsDeleteComponent,DateRangeComponent, LiquidationsGastosComponent, LiquidationsViajeComponent],
  imports: [
    CommonModule,
    LiquidationsRoutingModule,
    ModalModule,
    ButtonsModule,
    WavesModule,
    MDBBootstrapModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatToolbarModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMatDrpModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA]
})
export class LiquidationsModule { }
