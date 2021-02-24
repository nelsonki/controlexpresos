import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { Observable } from "rxjs";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { branchMsg } from "../../../utils/const/message";
import { ToastrService } from "ngx-toastr";
import { BranchServices } from '../branch-services/branch-services';
import {environment} from '../../../../environments/environment'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {HttpServices}from '../../../http/httpServices/httpServices'
@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss']
})
export class BranchFormComponent implements OnInit {
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
  openOptionClient: boolean = false;
  filteredOptions: Observable<string[]>;
  public disabledButoon: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public branchServices: BranchServices,
    private http: HttpServices,

  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({ 
      dni: ["", Validators.required],
      name: ["", Validators.required],
      address: ["", ""],
      client_id: ["", Validators.required],
      client: ["", Validators.required],

     });
  }
    public searchClient() {
    this.api = environment.apiJakiro2;
    let valueSearch = this.firstform.controls["client"].value;
    if (valueSearch.trim() !== "") {
      let enpoint = "clients/search/" + this.firstform.controls["client"].value;
      this.http.doGet(this.api, enpoint).subscribe((data: any) => {
        console.log(data);
        if (data.length > 0) {
          this.openOptionClient = true;
          this.filteredOptions = data;
        } else {
          this.openOptionClient = false;
          this.firstform.controls["client_id"].setValue("");
          this.firstform.controls["client"].setValue("");
        }
      });
    }
  }
  public setDataFormul(event, id, nombreComercial) {
    this.openOptionClient = false;
    this.firstform.controls["client_id"].setValue(id);
    this.firstform.controls["client"].setValue(nombreComercial);
  }
  public closeOption() {
    this.openOptionClient = false;
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
    this.firstform.controls["dni"].setValue(dataEdit[0]["dni"]);

    this.firstform.controls["client"].setValue(dataEdit[0]["cliente"]);
    this.firstform.controls["client_id"].setValue(dataEdit[0]["cliente_id"]);
    this.firstform.controls["name"].setValue(dataEdit[0]["name"]);
    this.firstform.controls["address"].setValue(dataEdit[0]["address"]);
  
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
        "dni": this.firstform.controls["dni"].value,

        "name": this.firstform.controls["name"].value,
        "address": this.firstform.controls["address"].value,
        "client_id": this.firstform.controls["client_id"].value,
 
      });
         // console.warn(bodyData);
          this.branchServices.update(this.idEdit, bodyData).subscribe(
            response => {
                  this.toasTer.success(branchMsg.update);
                  this.reloadComponent();
              },
              error => {
                if (error["status"] === 422) {
                  this.toasTer.error('Ya existe este DNI de sucursal');
                  this.loading = false;

                }else{
                      this.loading = false;
                this.toasTer.error(branchMsg.errorProcess);
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
            "client_id": this.firstform.controls["client_id"].value,

            });
           // console.log(bodyData);
            this.branchServices.save(bodyData).subscribe(
              response => {
                    this.toasTer.success(branchMsg.save);
                    this.reloadComponent();
                },
                error => {
                  if (error["status"] === 422) {
                    this.toasTer.error('Ya existe este DNI de sucursal');
                    this.loading = false;

                  }else{
                        this.loading = false;
                  this.toasTer.error(branchMsg.errorProcess);
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
}
