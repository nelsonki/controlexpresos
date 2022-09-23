import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficesTableComponent } from './offices-table/offices-table.component';
import { OfficesFormComponent } from './offices-form/offices-form.component';
import { OfficesDeleteComponent } from './dialog/offices-delete/offices-delete.component';
import { OfficesRoutingModule } from './offices-routing.module'

import { ModalModule, ButtonsModule, WavesModule } from 'angular-bootstrap-md';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatFormFieldModule } from '@angular/material/form-field';
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
 

@NgModule({
  declarations: [OfficesTableComponent, OfficesFormComponent, OfficesDeleteComponent],
  imports: [
    CommonModule,
    OfficesRoutingModule,
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
export class OfficesModule { }
