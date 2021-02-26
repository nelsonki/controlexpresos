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
import { serviceMsg } from "../../../utils/const/message";
import { ToastrService } from "ngx-toastr";
import { ServiceServices } from '../service-services/service-services';
import {environment} from '../../../../environments/environment'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {HttpServices}from '../../../http/httpServices/httpServices'

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public serviceServices: ServiceServices,
    public http: HttpServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({ 
      nombre: ["", Validators.required],
      margen: ["", Validators.required],
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
    this.firstform.controls["nombre"].setValue(dataEdit[0]["name"]);
    this.firstform.controls["margen"].setValue(dataEdit[0]["error_range"]);

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
        "name": this.firstform.controls["nombre"].value,
        "error_range": this.firstform.controls["margen"].value,

      });
         // console.warn(bodyData);
          this.serviceServices.update(this.idEdit, bodyData).subscribe(
            response => {
                  this.toasTer.success(serviceMsg.update);
                  this.reloadComponent();
              },
              error => {
                if (error["status"] === 422) {
                  this.toasTer.error('Ya existe este nombre de Servicio');
                  this.loading = false;

                }else{
                  this.loading = false;
                  this.toasTer.error(serviceMsg.errorProcess);
                  this.loading = false;
                }
              }
            );
            
       
      
    }
    else {
     

          this.loading = true;
          //let codFormatted = cod.trim().replace(/\s/g, "");//para que se usa
          let bodyData = Object.assign({
            "name": this.firstform.controls["nombre"].value,
            "error_range": this.firstform.controls["margen"].value,

            });
           // console.log(bodyData);
            this.serviceServices.save(bodyData).subscribe(
              response => {
                    this.toasTer.success(serviceMsg.save);
                    this.reloadComponent();
                },
                error => {
                  if (error["status"] === 422) {
                    this.toasTer.error('Ya existe este nombre de Servicio');
                    this.loading = false;
  
                  }else{
                    this.loading = false;
                    this.toasTer.error(serviceMsg.errorProcess);
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
