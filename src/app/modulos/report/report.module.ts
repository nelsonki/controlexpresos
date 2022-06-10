import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReportFormComponent } from './report-form/report-form.component';
import { ModalModule, ButtonsModule, WavesModule } from 'angular-bootstrap-md';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';

//import { HttpService } from '../../global-services/http.service';
import { MaterialModule } from './../../material.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
//import { ClientService } from './../../global-services/clients/client.service';
import { ReportRoutingModule } from './report-routing.module';
import { MatDialogModule, MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';


import { DateRangeComponent } from './date-range/date-range.component';
import { NgxMatDrpModule } from './date-range/modules/ngx-mat-drp/ngx-mat-drp.module';
import { ReportEntradaComponent } from './report-entrada/report-entrada.component';
import { ReportComponent } from './report.component';

@NgModule({
  declarations: [ReportComponent, ReportFormComponent, DateRangeComponent, ReportEntradaComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
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
    NgxMatDrpModule,
    MatSelectModule
  ],
  providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],

  bootstrap: [],

  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  entryComponents: [
    ReportFormComponent,
    ReportEntradaComponent
  ]
})
export class ReportModule { }
