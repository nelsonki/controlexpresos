import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, ButtonsModule, WavesModule } from 'angular-bootstrap-md';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { MatSelectModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {  MatIconModule } from '@angular/material/icon';
import {  MatTableModule } from '@angular/material/table';
import {  MatSortModule } from '@angular/material/sort';
import {  MatMenuModule } from '@angular/material/menu';
import {  MatPaginatorModule } from '@angular/material/paginator';
import {  MatInputModule } from '@angular/material/input';
import { MaterialModule } from './../../material.module';


import { ServiceTableComponent } from './service-table/service-table.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import {ServiceRoutingModule} from './service-routing.module'


@NgModule({
  declarations: [ServiceTableComponent, ServiceFormComponent],
  imports: [
    CommonModule,
    ServiceRoutingModule, 
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
export class ServiceModule { }
