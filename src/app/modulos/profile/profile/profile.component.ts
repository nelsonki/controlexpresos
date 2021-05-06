import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Input, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from "jquery";

//import { HttpService } from '../../../global-services/http.service';
//import { LocalService } from './../../../global-services/local-service.service';
//import { ClientService } from './../../../global-services/clients/client.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../../environments/environment';
//import { ICustomerType } from '../../../modules/settings/models/customer-type';
//import { IActivities } from '../../../modules/settings/models/activities';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  formClient: FormGroup;
  formPass: FormGroup;
  identificacion: FormGroup;
  public loadImg: any = '';
  public source: string = '';
  public profileImage;

  public userName;
  public account;
  public userRole;
  public apiUser;

  public userdni;
  public username;
  public userlastname;
  public userphone;
  public useraddress;
  public clientName;
  public clientname;
  public proveedor;
  //public types: ICustomerType[];
 // public activities: IActivities[];
  public idAct: number;
  public states: any[] = [];
  public codeContry:any;
  public codePhoneContry:any;
  public initialCountry: string = "{initialCountry: 'us'}";
  public hasErrorPhone: boolean = true;
  public numberPhone:any;
  public colorCoords: string = "primary";
 
  inputObj: any;
  public coordinate: any = [];
  public addressGoogle: string = "";
  @Input() element: string;

  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  @Output() statusCloseModal = new EventEmitter();

  constructor(public router: Router, 
              public toaster: ToastrService,
              //public http: HttpService, 
              private formBuilder: FormBuilder, 
              //public localService: LocalService,
              public cd: ChangeDetectorRef,
              //public clientService: ClientService,
              public dialog: MatDialog
              ) {

              }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      dni : [''],
      name : ['', Validators.required],
      email : ['', Validators.required],
     });
    this.formPass = this.formBuilder.group({
      password : ['', Validators.required],
      repeatPassword : ['', Validators.required]
     });
   // let info = this.localService.getJsonValue('info');
    //this.apiUser = environment.users;

    this.getUserData();
    //this.profileImage = this.localService.getJsonValue('image');
    //this.userRole = info.roles;
    
 
  }


  public compare(a, b, isAsc) {
    return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
}
  
getUserData(){/*
    this.http.getUser(this.apiUser).subscribe(( data: any ) => {
      this.userName = data.Usuario.username;
      this.form.controls['dni'].setValue(data.Usuario.dni);
      this.form.controls['name'].setValue(data.Usuario.name);
      this.form.controls['email'].setValue(data.Usuario.email);
      this.profileImage = this.localService.getJsonValue('image');
     });*/
  }
  
updateSource($event: Event) {
    this.projectImage($event.target['files'][0]);
}

projectImage(file: File) {
    this.loadImg = file;
    if ( file ){
        let reader = new FileReader;
        reader.onload = (e: any) => {
            this.profileImage = e.target.result;
            this.onChange.emit(file);
        };
        reader.readAsDataURL(file);
    } else{
      this.profileImage = '';
    }
  }

submitUpdateProfile() {
     let body ;
     if ( this.formPass.get('password').value === '') {
       body = {
        email: this.form.controls['email'].value,
        dni: this.form.controls['dni'].value,
        name: this.form.controls['name'].value,
        image: (this.profileImage === '') ? 'null' : this.profileImage,
      };
       this.profileImage = body.image;

     } else {
        body = {
        email: this.form.controls['email'].value,
        dni: this.form.controls['dni'].value,
        name: this.form.controls['name'].value,
        image: (this.profileImage === '') ? 'null' : this.profileImage,
        newPassword: this.formPass.controls['repeatPassword'].value
      };
        this.profileImage = body.image;

     }
     /*this.http.doPut(this.apiUser, 'users', body,  this.userName).subscribe( (data: any) => {
      if(data.status == 200) {
          this.toaster.success('La información ha sido modificada de forma exitosa');

      }
  }, (error: any) => {
        (error.error.message) ? this.toaster.error(error.error.message) : this.toaster.error('Proceso rechazado');
  });*/
     
}
goToMenu(){
  this.router.navigateByUrl('/dashboard/stats');
}


} 