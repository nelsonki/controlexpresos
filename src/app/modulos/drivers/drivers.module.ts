import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversTableComponent } from './drivers-table/drivers-table.component';
import { DriversFormComponent } from './drivers-form/drivers-form.component';
import { DriversRoutingModule } from './drivers-routing.module'

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
import { DriversDeleteComponent } from './dialog/drivers-delete/drivers-delete.component';


@NgModule({
  declarations: [DriversTableComponent, DriversFormComponent, DriversDeleteComponent],
  imports: [
    CommonModule,
    DriversRoutingModule,
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
export class DriversModule { }
