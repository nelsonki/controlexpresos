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

import { ToastrService } from "ngx-toastr";
import { ColorServices } from '../color-services/color-services';
import { branchMsg } from "../../../utils/const/message";

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss']
})
export class ColorFormComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public colorServices: ColorServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({ 
      color: ["", Validators.required],
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
    this.firstform.controls["color"].setValue(dataEdit[0]["color"]);
  
  }
  onSubmit(){
    
    this.submitted = true;
     if(this.firstform.invalid) {
      return;
    }else{
    if (this.putSubmit) {
      this.loading = true;
    

      let bodyData = Object.assign({
   
        "color": this.firstform.controls["color"].value,
 
      });
         // console.warn(bodyData);
          this.colorServices.update(this.idEdit, bodyData).subscribe(
            response => {
                  this.toasTer.success(branchMsg.update);
                  this.reloadComponent();
              },
              error => {
                this.loading = false;
                this.toasTer.error(branchMsg.errorProcess);
                this.loading = false;
              }
            );
        
      
    }
    else {
          this.loading = true;

          //let codFormatted = cod.trim().replace(/\s/g, "");//para que se usa
          let bodyData = Object.assign({
            "color": this.firstform.controls["color"].value,

            });
           // console.log(bodyData);
            this.colorServices.save(bodyData).subscribe(
              response => {
                    this.toasTer.success(branchMsg.save);
                    this.reloadComponent();
                },
                error => {
                  this.loading = false;
                  this.toasTer.error(branchMsg.errorProcess);
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
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
  }
  get f() {
    return this.firstform.controls;
  }
}
