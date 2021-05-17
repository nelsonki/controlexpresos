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
import { LocalService } from '../../../http/httpServices/local-service.service';
import { HttpService } from '../../../http/httpServices/http.service';
import { userMsg } from "../../../utils/const/message";
import { UserServices } from '../../user/user-services/user-services';

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
  public iduser;
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
 
  inputObj: any;
  public coordinate: any = [];
  public addressGoogle: string = "";
  @Input() element: string;

  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  @Output() statusCloseModal = new EventEmitter();

  constructor(public router: Router, 
              public toasTer: ToastrService,
              public http: HttpService, 
              private formBuilder: FormBuilder, 
              public localService: LocalService,
              public cd: ChangeDetectorRef,
              //public clientService: ClientService,
              public userServices: UserServices,

              public dialog: MatDialog,

              ) {

              }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      //dni : [''],
      name : ['', Validators.required],
      email : ['', Validators.required],
     });
    this.formPass = this.formBuilder.group({
      password : ['', Validators.required],
      repeatPassword : ['', Validators.required]
     });
    let info = this.localService.getJsonValue('info');
    this.apiUser = environment.apiJakiro2;

    this.getUserData();
    this.profileImage = this.localService.getJsonValue('image');
    this.userRole = info.rol;
    
 
  }


  public compare(a, b, isAsc) {
    return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
}
  
getUserData(){
    this.http.getUser(this.apiUser).subscribe(( data: any ) => {
      console.log(data[0])
      this.userName = data[0].fullname;
      this.iduser = data[0].id;

      //this.form.controls['dni'].setValue(data.Usuario.dni);
      this.form.controls['name'].setValue(data[0].fullname);
      this.form.controls['email'].setValue(data[0].email);
      this.profileImage = this.localService.getJsonValue('image');
     });
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
     let bodyData ;
      if ( this.formPass.get('password').value === '') {
        bodyData = {
          fullname: this.form.controls['name'].value,
          email: this.form.controls['email'].value,
          rol: this.userRole,
          image:(this.profileImage === '') ? 'null' : this.profileImage,
  
        };
        
       this.profileImage = bodyData.image;
console.log(bodyData)
     } else {
      bodyData = {
        fullname: this.form.controls['name'].value,
        email: this.form.controls['email'].value,
        rol: this.userRole,
        image:(this.profileImage === '') ? 'null' : this.profileImage,
        password: this.formPass.controls['repeatPassword'].value

      };
     
        this.profileImage = bodyData.image;
        console.log(bodyData)

     }
     this.userServices.update(this.iduser, bodyData).subscribe(
      response => {
            this.toasTer.success(userMsg.update);
            this.reloadComponent();
        },
        error => {
          if (error["status"] === 422) {
            this.toasTer.error('Ya existe ');

          }else{
            this.toasTer.error(userMsg.errorProcess);
          }
        }
      );
         
     
}
goToMenu(){
  this.router.navigate(['/dashboard/Stats']);
}

reloadComponent() {
  const currentUrl = this.router.url;
  const refreshUrl = currentUrl.indexOf("/dashboard/Stats") > -1 ? "/" : "/";
  this.router
    .navigateByUrl(refreshUrl)
    .then(() => this.router.navigateByUrl(currentUrl));
 }
} 