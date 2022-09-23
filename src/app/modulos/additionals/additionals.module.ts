import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddtionalsTableComponent } from './addtionals-table/addtionals-table.component';
import { AddtionalFormComponent } from './addtional-form/addtional-form.component';



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
import { AdditionalsDeleteComponent } from './dialog/additionals-delete/additionals-delete.component';
import { AdditionalsRoutingModule } from './additionals-routing.module'


@NgModule({
  declarations: [AddtionalsTableComponent, AddtionalFormComponent, AdditionalsDeleteComponent],
  imports: [
    CommonModule,
    AdditionalsRoutingModule,
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
export class AdditionalsModule { }
