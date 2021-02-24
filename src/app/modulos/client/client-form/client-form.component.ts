import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { clientsMsg } from "../../../utils/const/message";
import { ToastrService } from "ngx-toastr";
//import { TemplatesService } from '../templates-services/templates.service';
import {ClientServices} from '../client-services/client-services'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  @Input() element: string  ;
  @Output() statusCloseModal = new EventEmitter();
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

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
  public profileImage2=null;

  public loadImg: any = '';

  public putSubmit: boolean = false;
  public idEdit: any;

  public statusValidEmail: boolean = false;
  public fruits: string[] = [];
  public fruitCtrl = new FormControl();
  public email: any;

  readonly separatorKeysCodes2: number[] = [ENTER, COMMA];
  public visible2 = true;
  public selectable2 = true;
  public removable2 = true;
  public addOnBlur2 = true;
  public statusValidPhone: boolean = false;
  public fruits2: string[] = [];
  public fruitCtrl2 = new FormControl();
  public phone: any;


  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public clientServices: ClientServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({ 
      dni: ["", Validators.required],
      name: ["", Validators.required],
      address: ["", ""],
      fruitCtrl2: ["", ""],
      fruitCtrl: ["", ""],

    });
  }
  public addForm(id) { 
    this.fruits = [];
 
    this.idEdit = id;
    let dataEdit = [];
    this.editSubmit = true;
    this.putSubmit = true;
    Object.keys(this.element).forEach(i => {
      if (this.element[i].id == id) {
        dataEdit.push(this.element[i]);
      }
    });
    //console.log(dataEdit[0]);
    this.firstform.controls["dni"].setValue(dataEdit[0]["dni"].toLowerCase());
    this.firstform.controls["name"].setValue(dataEdit[0]["name"]);
    this.firstform.controls["address"].setValue(dataEdit[0]["address"]);

    var phones = (dataEdit[0]["phone"])? dataEdit[0]["phone"].split(","): "";
    this.fruits2 = (phones !== "") ? phones : [];

    var emails = (dataEdit[0]["email"])? dataEdit[0]["email"].split(","): "";
    this.fruits = (emails !== "") ? emails : [];
    this.profileImage2 = dataEdit[0]["image"]
  }
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
  }
  projectImage2(file1: File) {
    this.loadImg = file1;
    if ( file1){
        let reader = new FileReader;
        reader.onload = (e: any) => {
            this.profileImage2 = e.target.result;
            this.onChange.emit(file1);
        };
        reader.readAsDataURL(file1);
    } else{
      this.profileImage2 = '';
    }
  }
  updateSource2($event: Event) {
    this.projectImage2($event.target['files'][0]);
  }
  onSubmit(){
    this.email = "";
    this.phone = "";

    this.submitted = true;
     if(this.firstform.invalid) {
      return;
    }else{
      /////correo
      Object.keys(this.fruits).forEach(i => {
                this.email += this.fruits[i] + ",";
      });
      var emailData = this.email.substring(0, this.email.length - 1);
      /////telefono
      Object.keys(this.fruits2).forEach(i => {
        this.phone += this.fruits2[i] + ",";
      });
      var phoneData = this.phone.substring(0, this.phone.length - 1);
    if (this.putSubmit) {
      this.loading = true;
      

      let bodyData = Object.assign({
        "dni": this.firstform.controls["dni"].value,
        "name": this.firstform.controls["name"].value,
        "address": this.firstform.controls["address"].value,
        "phone": phoneData,
        "email": emailData,
        'image':  (this.profileImage2 === '') ? 'null' : this.profileImage2,

      });
      this.profileImage2 = bodyData.image;

          console.warn(bodyData);
          this.clientServices.update(this.idEdit, bodyData).subscribe(
            response => {
                  this.toasTer.success(clientsMsg.update);
                  this.reloadComponent();
              },
              error => {
                if (error["status"] === 422) {
                  this.toasTer.error('Ya existe este DNI de cliente');
                  this.loading = false;

                }else{
                      this.loading = false;
                this.toasTer.error(clientsMsg.errorProcess);
                this.loading = false;
                }
              }
            );
      
      
    }
    else {
          this.loading = true;
 
          //let codFormatted = cod.trim().replace(/\s/g, "");//para que se usa
          let bodyData = Object.assign({
            "dni": this.firstform.controls["dni"].value,
            "name": this.firstform.controls["name"].value,
            "address": this.firstform.controls["address"].value,
            "phone": phoneData,
            "email": emailData,
            'image':  (this.profileImage2 === '') ? 'null' : this.profileImage2,

            });
            this.profileImage2 = bodyData.image;

            console.log(bodyData);
           this.clientServices.save(bodyData).subscribe(
              response => {
                    this.toasTer.success(clientsMsg.save);
                    this.reloadComponent();
                },
                 
                error => {
                  if (error["status"] === 422) {
                    this.toasTer.error('Ya existe este DNI de cliente');
                    this.loading = false;

                  }else{
                        this.loading = false;
                  this.toasTer.error(clientsMsg.errorProcess);
                  this.loading = false;
                  }
              
                }
                
              );
          
        
      }
    }
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("dashboard") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
   }
  get f() {
    return this.firstform.controls;
  }

  //////////////correo///////////////////////////////////////////////////
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    //console.log(value);
    let statusEmail = this.validarCorreo(value);
    if (statusEmail) {
        this.statusValidEmail = false;
        if ((value || "").trim()) {
            this.fruits.push(value.trim());
        }
        // Reset the input value
        if (input) {
            input.value = "";
        }
        this.fruitCtrl.setValue(null);
    } else {
        this.statusValidEmail = true;
    }

    console.log(this.fruits);
}


public validarCorreo(valor) {
    var status;
    let regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;

    if (regex.test(valor.trim())) {
        status = true;
        console.log('Correo validado');

    } else {
        status = false;
        console.log('La direccón de correo no es válida');
    }
    return status;
}

remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
        this.fruits.splice(index, 1);
    }
    this.firstform.controls["fruitCtrl"].setValue(this.fruits);
}

public eliminateDuplicates(arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};

    for (i = 0; i < len; i++) {
        obj[arr[i]] = 0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}
/////////////////////validar teléfono
addPhone(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;
  // Add our fruit
  //console.log(value);
  let statusEmail = this.validarTelefono(value);
  if (statusEmail) {
      this.statusValidPhone = false;
      if ((value || "").trim()) {
          this.fruits2.push(value.trim());
      }
      // Reset the input value
      if (input) {
          input.value = "";
      }
      this.fruitCtrl2.setValue(null);
  } else {
      this.statusValidPhone = true;
  }

  console.log(this.fruits);
}
public validarTelefono(valor) {
  var status;
  let regex = /[0-9]{9}/;

  if (regex.test(valor.trim())) {
      status = true;
      console.log('teléfono validado');

  } else {
      status = false;
      console.log('Teléfono no es válida');
  }
  return status;
}
removePhone(fruit2: string): void {
  const index = this.fruits2.indexOf(fruit2);
  if (index >= 0) {
      this.fruits2.splice(index, 1);
  }
  this.firstform.controls["fruitCtrl2"].setValue(this.fruits2);
}
}
