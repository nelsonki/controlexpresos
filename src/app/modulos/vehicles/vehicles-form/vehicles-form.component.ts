
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
import { VehiclesServices } from '../vehicles-services/vehicles-services';
import { colorMsg } from "../../../utils/const/message";

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { environment } from '../../../../environments/environment'
import { HttpServices } from '../../../http/httpServices/httpServices'

@Component({
  selector: 'app-vehicles-form',
  templateUrl: './vehicles-form.component.html',
  styleUrls: ['./vehicles-form.component.scss']
})
export class VehiclesFormComponent implements OnInit {
  @Input() element: string;
  @Output() statusCloseModal = new EventEmitter();

  public firstform: FormGroup;
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
    public vehiclesServices: VehiclesServices,
    public http: HttpServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({
      tipo: ["", Validators.required],
      placa: ["", Validators.required],
      numero: ["", Validators.required],
      description: ["", Validators.required],

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
    this.firstform.controls["placa"].setValue(dataEdit[0]["placa"]);
    this.firstform.controls["numero"].setValue(dataEdit[0]["number"]);
    this.firstform.controls["tipo"].setValue(dataEdit[0]["type"]);
    this.firstform.controls["description"].setValue(dataEdit[0]["description"]);

  }
  onSubmit() {

    this.submitted = true;
    if (this.firstform.invalid) {
      return;
    } else {
      if (this.putSubmit) {


        this.loading = true;
        let bodyData = Object.assign({

          "placa": this.firstform.controls["placa"].value,
          "number": this.firstform.controls["numero"].value,
          "type": this.firstform.controls["tipo"].value,
          "description": this.firstform.controls["description"].value,

        });

        this.vehiclesServices.update(this.idEdit, bodyData).subscribe(
          response => {
            this.toasTer.success(colorMsg.update);
            this.reloadComponent();
          },
          error => {
            if (error["status"] === 422) {
              this.toasTer.error('Ya existe este nombre de Color');
              this.loading = false;

            } else {
              this.loading = false;
              this.toasTer.error(colorMsg.errorProcess);
              this.loading = false;
            }
          }
        );


      }
      else {

        this.loading = true;
        let bodyData = Object.assign({
          "placa": this.firstform.controls["placa"].value,
          "number": this.firstform.controls["numero"].value,
          "type": this.firstform.controls["tipo"].value,
          "description": this.firstform.controls["description"].value,
        });
        this.vehiclesServices.save(bodyData).subscribe(
          response => {
            this.toasTer.success(colorMsg.save);
            this.reloadComponent();
          },
          error => {
            if (error["status"] === 422) {
              this.toasTer.error('Ya existe este nombre de Color');
              this.loading = false;

            } else {
              this.loading = false;
              this.toasTer.error(colorMsg.errorProcess);
              this.loading = false;
            }
          }
        );





      }
    }
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("/dashboard/vehicles") > -1 ? "/" : "/";
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
