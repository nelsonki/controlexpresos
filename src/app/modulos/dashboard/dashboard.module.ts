import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
 import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from '../../material.module';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    MatToolbarModule,
    MatMenuModule,
    ChartModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]

})
export class DashboardModule { }
