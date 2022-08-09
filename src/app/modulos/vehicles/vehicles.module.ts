import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesTableComponent } from './vehicles-table/vehicles-table.component';

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
import { MaterialModule } from './../../material.module';


import { VehiclesRoutingModule } from './vehicles-routing.module';
import { VehiclesFormComponent } from './vehicles-form/vehicles-form.component';
import { VehiclesDeleteComponent } from './dialog/vehicles-delete/vehicles-delete.component'

@NgModule({
  declarations: [VehiclesTableComponent, VehiclesFormComponent, VehiclesDeleteComponent],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
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
export class VehiclesModule { }
