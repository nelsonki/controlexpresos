import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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


import { SalidasTableComponent } from './salidas-table/salidas-table.component';
import {SalidasRoutingModule} from './salidas-routing.module';
import { SalidasFormComponent } from './salidas-form/salidas-form.component'


@NgModule({
  declarations: [SalidasTableComponent, SalidasFormComponent],
  imports: [
    CommonModule,
    SalidasRoutingModule,
    CommonModule,
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
    ReactiveFormsModule
  ]
})
export class SalidasModule { }
