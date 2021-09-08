import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { ModalModule, ButtonsModule, WavesModule } from 'angular-bootstrap-md';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {  MatIconModule } from '@angular/material/icon';
import {  MatTableModule } from '@angular/material/table';
import {  MatSortModule } from '@angular/material/sort';
import {  MatMenuModule } from '@angular/material/menu';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from './../../material.module';




import { ProcessedTableComponent } from './processed-table/processed-table.component';
import {ProcessedRoutingModule} from '../processed/processed-routing.module'
import { DateRangeComponent } from './date-range/date-range.component';
import { NgxMatDrpModule } from './date-range/modules/ngx-mat-drp/ngx-mat-drp.module';
import { ProcessedCancelComponent } from './dialog/processed-cancel/processed-cancel.component';


@NgModule({
  declarations: [ProcessedTableComponent, DateRangeComponent, ProcessedCancelComponent],
  imports: [
    CommonModule,
    ProcessedRoutingModule,
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
export class ProcessedModule { }
