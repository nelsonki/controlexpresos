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
      address: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", Validators.required]
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
    //console.log(dataEdit[0]);
    this.firstform.controls["dni"].setValue(dataEdit[0]["dni"].toLowerCase());
    this.firstform.controls["name"].setValue(dataEdit[0]["name"]);
    this.firstform.controls["address"].setValue(dataEdit[0]["address"]);
    this.firstform.controls["phone"].setValue(dataEdit[0]["phone"]);
    this.firstform.controls["email"].setValue(dataEdit[0]["email"]);

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
    
    this.submitted = true;
     if(this.firstform.invalid) {
      return;
    }else{
    if (this.putSubmit) {
      this.loading = true;
    

      let bodyData = Object.assign({
        "dni": this.firstform.controls["dni"].value,
        "name": this.firstform.controls["name"].value,
        "address": this.firstform.controls["address"].value,
        "phone": this.firstform.controls["phone"].value,
        "email": this.firstform.controls["email"].value,
        //'imagen':  (this.profileImage2 === '') ? 'null' : this.profileImage2,

      });
      this.profileImage2 = bodyData.image;

          console.warn(bodyData);
          this.clientServices.update(this.idEdit, bodyData).subscribe(
            response => {
                  this.toasTer.success(clientsMsg.update);
                  this.reloadComponent();
              },
              error => {
                this.loading = false;
                this.toasTer.error(clientsMsg.errorProcess);
                this.loading = false;
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
            "phone": this.firstform.controls["phone"].value,
            "email": this.firstform.controls["email"].value,
            //'imagen':  (this.profileImage2 === '') ? 'null' : this.profileImage2,

            });
            this.profileImage2 = bodyData.image;

            console.log(bodyData);
           this.clientServices.save(bodyData).subscribe(
              response => {
                    this.toasTer.success(clientsMsg.save);
                    this.reloadComponent();
                },
                error => {
                  this.loading = false;
                  this.toasTer.error(clientsMsg.errorProcess);
                  this.loading = false;
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
}
