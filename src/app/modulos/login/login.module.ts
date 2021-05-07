//import { AngularFireAuthModule } from "@angular/fire/auth";
//import { AngularFireModule } from "@angular/fire";
//import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
//import { HttpService } from '../../global-services/http.service';
//import { LocalService } from '../../global-services/local-service.service'
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { MaterialModule } from '../../material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
//import { RecoverComponent } from './recover/recover.component';
//import { RegisterComponent } from './register/register.component';
import { environment } from 'src/environments/environment';
//import { PartnerRegisterComponent } from './partner-register/partner-register.component';
//import { WelcomePartnerComponent } from './welcome-partner/welcome-partner.component';
//import { RegisterPartnerService } from './services/register-partner.service';
//import { HttpServices } from 'src/app/common/http/httpServices/httpServices';
//import { FinishRegisterComponent } from './finish-register/finish-register.component';
//import { PartnersMapComponent } from './map/partners-map/partners-map.component';
//import { SaveAccountComponent } from './partner-register/dialogs/save-account/save-account.component';
//import { PartnerAddressMapComponent } from './partner-register/dialogs/partner-address-map/partner-address-map.component';
//import { AgmCoreModule } from '@agm/core';
//import { AgmDirectionModule } from 'agm-direction';
//import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
//import { LoginDialogAccountComponent } from './login/dialog/login-dialog-account/login-dialog-account.component';
//import { LoginDialogClientComponent } from './login/dialog/login-dialog-client/login-dialog-client.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    //AngularFireModule.initializeApp(environment.firebaseConfig),
    //AngularFireAuthModule,
    //Ng2TelInputModule,
    /*AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC2qEKTPAn8rA9oyxtBXSAj_yZHjWlQ-2k', // 'AIzaSyC2qEKTPAn8rA9oyxtBXSAj_yZHjWlQ-2k',
      language: 'es',
      libraries: ['geometry', 'places']
    }),
    AgmDirectionModule,     // agm-direction
    GooglePlaceModule*/

  ],
  entryComponents: [/*
    SaveAccountComponent,
     PartnerAddressMapComponent,
      LoginDialogAccountComponent,
       LoginDialogClientComponent*/
      ],
  providers: [/*
    HttpService,
     LocalService,
      AuthService, 
      RegisterPartnerService, 
      HttpServices*/
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginModule { }
