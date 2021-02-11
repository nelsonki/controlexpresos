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
import {MatDialogModule} from '@angular/material/dialog';
 
   
 import { HttpClientModule } from '@angular/common/http';
//import { HttpService } from './global-services/http.service';
//import { HttpServicesBoardings } from './modules/http/httpServices/httpServicesBoardings';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrModule } from 'ngx-toastr';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ModalModule, ButtonsModule, WavesModule } from 'angular-bootstrap-md';

import {HttpServices} from '../app/http/httpServices/httpServices';
import {ClientServices}from '../app/modulos/client/client-services/client-services'
import {BranchServices}from '../app/modulos/branch/branch-services/branch-services'

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { DashboardComponent } from './modulos/dashboard/dashboard/dashboard.component';

  registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
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
    MatAutocompleteModule
 
    
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
    HttpServices, ClientServices, BranchServices
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class AppModule { }
