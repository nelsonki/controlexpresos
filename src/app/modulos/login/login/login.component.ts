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
      email: formData.username.trim(),
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
            this.localService.setJsonValue('iduserlog', data.id);
             console.log(this.localService)
             this.router.navigate(['/dashboard/Stats'])
          //}

       
        /* if (data.user.image) {
          this.localService.setJsonValue('image', data.user.image);

        } else {
          this.localService.setJsonValue('image', '../../../../assets/userProfile.png');

        }  */
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
 
 

 
}

