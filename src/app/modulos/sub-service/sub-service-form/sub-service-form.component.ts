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
import { subserviceMsg } from "../../../utils/const/message";
import { ToastrService } from "ngx-toastr";
import { SubServiceServices } from '../sub-service-services/sub-service-services';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {environment} from '../../../../environments/environment'
import {HttpServices}from '../../../http/httpServices/httpServices'

@Component({
  selector: 'app-sub-service-form',
  templateUrl: './sub-service-form.component.html',
  styleUrls: ['./sub-service-form.component.scss']
})
export class SubServiceFormComponent implements OnInit {
  @Input() element: string  ;
  @Output() statusCloseModal = new EventEmitter();
  
  public firstform: FormGroup ;
  public submitted = false;
  public loading: boolean = false;
  public editSubmit: boolean = false;
  public closeStatus: boolean = false;
  public api;
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public taskList = [];

  public putSubmit: boolean = false;
  public idEdit: any;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public subServiceServices: SubServiceServices,
    public http: HttpServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({ 
      name: ["", Validators.required],

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
    this.firstform.controls["name"].setValue(dataEdit[0]["name"]);

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
      

      this.api = environment.apiJakiro2;
      let valueSearch = this.firstform.controls["name"].value;
      if (valueSearch.trim() !== "") {
        let enpoint = "subservices/search/" + this.firstform.controls["name"].value;
        this.http.doGet(this.api, enpoint).subscribe((data: any) => {
          console.log(data);
          if (data=== true) {
                this.firstform.controls["name"].setValue("");
                this.toasTer.error("Ya existe este nombre de sub-servicio");
                this.loading = false;
                return;
          } else {

      this.loading = true;
      let bodyData = Object.assign({
         "name": this.firstform.controls["name"].value,
      });
         // console.warn(bodyData);
          this.subServiceServices.update(this.idEdit, bodyData).subscribe(
            response => {
                  this.toasTer.success(subserviceMsg.update);
                  this.reloadComponent();
              },
              error => {
                this.loading = false;
                this.toasTer.error(subserviceMsg.errorProcess);
                this.loading = false;
              }
            );
        
          }
        });
      }
             
    }
    else {


      this.api = environment.apiJakiro2;
      let valueSearch = this.firstform.controls["name"].value;
      if (valueSearch.trim() !== "") {
        let enpoint = "subservices/search/" + this.firstform.controls["name"].value;
        this.http.doGet(this.api, enpoint).subscribe((data: any) => {
          console.log(data);
          if (data=== true) {
                this.firstform.controls["name"].setValue("");
                this.toasTer.error("Ya existe este nombre de sub-servicio");
                this.loading = false;
                return;
          } else {
            this.loading = true;
            let bodyData = Object.assign({
              "name": this.firstform.controls["name"].value,
              });
              this.subServiceServices.save(bodyData).subscribe(
                response => {
                      this.toasTer.success(subserviceMsg.save);
                      this.reloadComponent();
                  },
                  error => {
                    this.loading = false;
                    this.toasTer.error(subserviceMsg.errorProcess);
                    this.loading = false;
                  }
                );
  
          }
        });
      }
        
          

 
          
        
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
