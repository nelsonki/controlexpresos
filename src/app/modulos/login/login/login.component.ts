//import * as firebase from 'firebase/app';

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
//import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../http/httpServices/http.service';

//import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
//import { HttpService } from '../../../global-services/http.service';
import { LocalService } from '../../../http/httpServices/local-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
//import { auth } from 'firebase/app';
import { environment } from './../../../../environments/environment';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  public form: FormGroup;
  public api = environment.apiJakiro2;
  public firebaseToken;
  public resultFirebase;
  public accountUser: number;
  public infoAccount: any[] = [];

  constructor(
    public fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private ngZone: NgZone,
    private toastr: ToastrService,
    public http: HttpService,
    public cd: ChangeDetectorRef,
    public router: Router,
    public dialog: MatDialog,
    //public afAuth: AngularFireAuth,
    public localService: LocalService,
    public authService: AuthService
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.firebaseToken = '';
  }
  ngAfterViewInit() {

  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 1000,
    });
  }
  onEnter() {
    this.sendData();
  }

  sendData() {
    //this.navigateTo('/dashboard/Stats');
   
    const formData = this.form.value;
    let object = {
      password: formData.password,
      username: formData.username.trim(),
      // account: 9
    } 
    if (this.form.valid) { 
      this.http.doPost('login', object, this.api).subscribe((data: any) => {
        console.log(data);        
      
         
          /*if (data.user.status === 2) {
            this.toastr.error('Usuario bloqueado, consulte al administrador', 'Error');
          } else if (data.user.roles[0].id != 1 && data.user.roles[0].id != 9 && data.user.roles[0].id != 10) {
            this.toastr.error('Acceso no autorizado', 'Error');
          } else {*/
            this.localService.setJsonValue('info', data);
            
            //this.localService.setJsonValue('iduserlog', data.id);
             console.log(this.localService)
             let info = this.localService.getJsonValue('info');
             if(info.rol.toLowerCase() === 'op_entradas'){
              this.router.navigate(['/dashboard/Entradas'])

             }else{
              this.router.navigate(['/dashboard/Stats'])

             }
          //}

       
        if (data.image) {
          this.localService.setJsonValue('image', data.image);

        } else {
          this.localService.setJsonValue('image', '../../../../assets/userProfile.png');

        }  
      }, (error) => {
        
          this.toastr.error('Error en las credenciales', 'Sistema Jakiro');
        
        
      }, () => {

      }); 
     
    } else {
      this.toastr.error('Los campos son requeridos', 'Sistema Jakiro');

    }
  }

 
  navigateTo(url) {
    this.router.navigate([url]);

  }
  // Auth logic to run auth providers
  AuthLogin(provider) {/*
    const that = this;
    let user = firebase.auth().currentUser;
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result: any) => {
        this.resultFirebase = result;
        this.firebaseToken = result.user._lat;
        const body = {
          account: 9
        };
        this._snackBar.open('Consultando usuario.. por favor espere');
        this.ngZone.run(() => {
          this.checkUser(body);
        });


      }).catch((error) => {
        console.log(error);
        if (error.code === 'auth/popup-closed-by-user') {
          // this.toaster.error('El usuario cancelo la autenticacion')
        }
        if (error.code === 'auth/cancelled-popup-request') {
          // this.toaster.error('La operacion se cancelo debido a que hay otra ventana abierta, intente nuevamente')

        }
      });*/
  }

  // checkIfUserExits
  checkUser(body) {/*
    setTimeout(() => {
      this._snackBar.open('verificando usuario...por favor espere...');

      this.http.doPostFirebase('social/login', body, this.apiUsers, this.firebaseToken).subscribe((data: any) => {
        console.log(data);
        this.localService.setJsonValue('info', data);
        this.localService.setJsonValue('iduserlog', data.User.id);

        this.localService.setJsonValue('image', this.resultFirebase.additionalUserInfo.profile.picture);

        this.getClientId(data.User.username, data.User.account);

        this._snackBar.open('iniciando sesión...por favor espere...');
        setTimeout(() => {
          let role = this.http.checkRole();
          if (role) {
            this.navigateTo('/dashboard/recharge');
          } else {
            this.navigateTo('/dashboard/stats');
          }

          this._snackBar.dismiss();
        }, 1000);



      }, (error) => {
        console.log('ingresa ', error)
        if (error.status === 401) {
          this.toastr.error('Acceso no autorizado');
          this._snackBar.dismiss();
        }
        if (error.status === 403) {
          this.toastr.error('Usuario bloqueado');
          this._snackBar.dismiss();
        }
        if (error.status === 404) {
          setTimeout(() => {
            this._snackBar.open('El usuario no existe, se procedera a registrar. por favor espere...');

            const fullname = this.resultFirebase.additionalUserInfo.profile.name.split(' ');
            const name = fullname[0];
            const lastname = fullname[1];
            const json = {
              address: '',
              status: '1',
              account: 9,
              dni: '',
              role: '4',
              last_name: lastname,
              username: this.resultFirebase.additionalUserInfo.profile.username,
              username: this.resultFirebase.additionalUserInfo.profile.username,
              name: name
            };
            // tslint:disable-next-line: align
            this.userGets404(json);
          }, 1000);
        }
      }, () => {

      });
    }, 1000);*/
  }
  // si usuario no existe
  userGets404(json) {/*
    setTimeout(() => {
      this._snackBar.open('Registrando usuario. por favor espere...');

      this.http.doPost('users', json, this.apiUsers).subscribe((data: any) => {

        if (data.status === 201) {
          this._snackBar.open('Usuario registrado con éxito!!');
        }
      }, (error: any) => {
        console.log(error);
      }, () => {
        setTimeout(() => {
          this._snackBar.open('Obteniendo credenciales para el inicio de sesión...por favor espere...');
          this.gettoken();
        }, 1000);


      });
    }, 1000);*/

  }
  gettoken() {/*
    const body = {
      account: 9
    };

    this.http.doPostFirebase('social/login', body, this.apiUsers, this.firebaseToken).subscribe((data: any) => {
      this.localService.setJsonValue('info', data);
      this.localService.setJsonValue('iduserlog', data.User.id);

      this.localService.setJsonValue('image', this.resultFirebase.additionalUserInfo.profile.picture);
      this.getClientId(data.User.username, data.User.account);
      let role = this.http.checkRole();
      if (role) {
        this.navigateTo('/dashboard/recharge');
      } else {
        this.navigateTo('/dashboard/stats');
      }
      this._snackBar.dismiss();
    });*/
    
  }

 
}

