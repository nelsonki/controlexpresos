import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

//import { Ng2TelInputModule } from 'ng2-tel-input';
import { MatDialogModule } from '@angular/material/dialog';


import { HttpClientModule } from '@angular/common/http';
//import { HttpService } from './global-services/http.service';
//import { HttpServicesBoardings } from './modules/http/httpServices/httpServicesBoardings';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrModule } from 'ngx-toastr';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ModalModule, ButtonsModule, WavesModule } from 'angular-bootstrap-md';

import { HttpServices } from '../app/http/httpServices/httpServices';
import { DriversServices } from '../app/modulos/drivers/drivers-services/drivers-services'
import { BranchServices } from '../app/modulos/branch/branch-services/branch-services'
import { ColorServices } from '../app/modulos/color/color-services/color-services'
import { ServiceServices } from '../app/modulos/service/service-services/service-services'
import { SubServiceServices } from '../app/modulos/sub-service/sub-service-services/sub-service-services'
import { StatsServices } from '../app/modulos/stats/stats-services/stats-services'
import { UserServices } from '../app/modulos/user/user-services/user-services'
import { IndicadoresServices } from '../app/modulos/indicadores/indicadores-services/indicadores-services'
import { SettingsServices } from '../app/modulos/settings/settings-services/settings-services'
import { VehiclesServices } from '../app/modulos/vehicles/vehicles-services/vehicles-services'

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { DashboardComponent } from './modulos/dashboard/dashboard/dashboard.component';
import { importType } from '@angular/compiler/src/output/output_ast';
import { ChartModule } from 'angular-highcharts';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
//import { ProfileComponent } from './modulos/profile/profile/profile.component';
import { CanActivateViaAuthGuard } from './guard';
import { PartnersServices } from './modulos/partners/partners-services/partners-services';
import { CoinsServices } from './modulos/coins/coins-services/coins-services';
import { AdditionalsServices } from './modulos/additionals/addtionals-services/additionals-services';
import { OfficesServices } from './modulos/offices/offices-services/offices-services';
import { LiquidationsServices } from './modulos/liquidations/liquidations-services/liquidations-services';
import { GastosvariosServices } from './modulos/gastosvarios/gastosvarios-services/gastosvarios-services';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    //ProfileComponent
  ],
  imports: [

    LoadingBarHttpClientModule,
    LoadingBarModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    //Ng2TelInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    // APP_ROUTES,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatSidenavModule,
    MatMenuModule,
    MDBBootstrapModule.forRoot(),
    ModalModule, ButtonsModule, WavesModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    ChartModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),

  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatAutocompleteModule

  ],

  providers: [
    HttpServices,
    BranchServices,
    ColorServices,
    ServiceServices,
    SubServiceServices,
    StatsServices,
    UserServices,
    CanActivateViaAuthGuard,
    IndicadoresServices,
    SettingsServices,
    VehiclesServices,
    PartnersServices,
    DriversServices,
    CoinsServices,
    AdditionalsServices,
    OfficesServices,
    LiquidationsServices,
    GastosvariosServices
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class AppModule { }
