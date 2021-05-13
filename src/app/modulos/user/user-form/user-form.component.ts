import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { userMsg } from "../../../utils/const/message";
import { ToastrService } from "ngx-toastr";
import { UserServices } from '../user-services/user-services';
import {environment} from '../../../../environments/environment'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {HttpServices}from '../../../http/httpServices/httpServices'

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() element: string  ;
  @Output() statusCloseModal = new EventEmitter();
  
  public firstform: FormGroup ;
  public submitted = false;
  public loading: boolean = false;
  public editSubmit: boolean = false;
  public closeStatus: boolean = false;

  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public taskList = [];

  public putSubmit: boolean = false;
  public idEdit: any;

  public api;
  public roles:  any[]= [
    {value:'operador', name:'Operador'},
    {value:'admin', name:'Admin'}
  ]
  

  

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public userServices: UserServices,
    public http: HttpServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({ 
      nombre: ["", Validators.required],
      email: ["", Validators.required],
      rol: ["", Validators.required],
      clave: ["", Validators.required],
      rclave: ["", Validators.required],

    });
  }
  public addForm(id) {  
    this.idEdit = id;
    let dataEdit = [];
    this.editSubmit = true;
    this.putSubmit = true;
    Object.keys(this.element).forEach(i => {
      if (this.element[i].id == id) {
        dataEdit.push(this.element[i]);
      }
    });
    console.log(dataEdit[0]);
    this.firstform.controls["nombre"].setValue(dataEdit[0]["name"]);
    this.firstform.controls["email"].setValue(dataEdit[0]["email"]);
    this.firstform.controls["rol"].setValue(dataEdit[0]["rol"]);


  }
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
  }
onSubmit(){
    
    this.submitted = true;
     if(this.firstform.invalid) {
      return;
    }else{
    if (this.putSubmit) {
      
      this.loading = true;
      let bodyData = Object.assign({
        "fullname": this.firstform.controls["nombre"].value,
        "email": this.firstform.controls["email"].value,
        "rol": this.firstform.controls["rol"].value,
        "password": this.firstform.controls["clave"].value,

      });
      let repeatPass = this.firstform.controls["rclave"].value;
            if ( bodyData.password === repeatPass ) {
         // console.warn(bodyData);
          this.userServices.update(this.idEdit, bodyData).subscribe(
            response => {
                  this.toasTer.success(userMsg.update);
                  this.reloadComponent();
              },
              error => {
                if (error["status"] === 422) {
                  this.toasTer.error('Ya existe ');
                  this.loading = false;

                }else{
                  this.loading = false;
                  this.toasTer.error(userMsg.errorProcess);
                  this.loading = false;
                }
              }
            );
          }else{
            this.toasTer.error('Las contraseñas no coinciden', 'Sistema Jakiro');

          } 
       
      
    }
    else {
          this.loading = true;
          let bodyData = Object.assign({
            "fullname": this.firstform.controls["nombre"].value,
            "email": this.firstform.controls["email"].value,
            "rol": this.firstform.controls["rol"].value,
            "password": this.firstform.controls["clave"].value,

            });
            let repeatPass = this.firstform.controls["rclave"].value;
            if ( bodyData.password === repeatPass ) {
           // console.log(bodyData);
            this.userServices.save(bodyData).subscribe(
              response => {
                    this.toasTer.success(userMsg.save);
                    this.reloadComponent();
                },
                error => {
                  if (error["status"] === 422) {
                    this.toasTer.error('Ya existe ');
                    this.loading = false;
  
                  }else{
                    this.loading = false;
                    this.toasTer.error(userMsg.errorProcess);
                    this.loading = false;
                  }
                }
              );
              }else{
                this.toasTer.error('Las contraseñas no coinciden', 'Sistema Jakiro');

              }

        


      }
    }
}
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("/dashboard/user") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
   } 
get f() {
    return this.firstform.controls;
  }
}
