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


//import { SubServiceTableComponent } from './sub-service-table/sub-service-table.component';
//import { SubServiceFormComponent } from './sub-service-form/sub-service-form.component';
//import {SubServiceRoutingModule} from './sub-service-routing.module';
//import { SubServiceDeleteComponent } from './dialog/sub-service-delete/sub-service-delete.component'

import { UserTableComponent } from './user-table/user-table.component';
import {UserRoutingModule} from './user-routing.module';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDeleteComponent } from './dialog/user-delete/user-delete.component'
@NgModule({
  declarations: [UserTableComponent, UserFormComponent, UserDeleteComponent ],
  imports: [
    CommonModule,
    UserRoutingModule, 
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
export class UserModule { }

