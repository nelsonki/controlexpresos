
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
import {Observable} from 'rxjs'
import { map, startWith } from 'rxjs/operators';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { environment } from '../../../../environments/environment'
import { HttpServices } from '../../../http/httpServices/httpServices'
import {PartnersServices} from './../../partners/partners-services/partners-services'
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface Socios {
  id: number;
  name: string;
}
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

  //buscar socios
  public filteredOptions4: Observable<Socios[]>;
  public options4: Array<any> = [];
  public idsubservicio4 = 0;

 
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    private vehiclesServices: VehiclesServices,
    private partnersServices: PartnersServices,
    public http: HttpServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({
      tipo: ["", Validators.required],
      placa: ["", Validators.required],
      numero: ["", Validators.required],
      description: ["", Validators.required],
      socio: ["", Validators.required],
      socio_id: ["", Validators.required],

    });
         /*BUSCAR SOCIO*/
         this.partnersServices.getList().pipe()
         .subscribe((value) => {
           console.log(value["data"])
           Object.keys(value["data"]).forEach(i => {
             this.options4.push(
               {
                 "id": value["data"][i].id,
                 "name": value["data"][i].first_name,
    
               }
    
             );
    
           });
         });
       this.filteredOptions4 = this.firstform.controls['socio'].valueChanges.pipe(
         startWith(''),
         map(value => typeof value === 'string' ? value : value.name),
         map(name => name ? this._filter4(name) : this.options4.slice())
       );
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
    this.firstform.controls["tipo"].setValue(dataEdit[0]["status"]);
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
          "plate": this.firstform.controls["placa"].value,
          "num_control": this.firstform.controls["numero"].value,
          "status": this.firstform.controls["tipo"].value,
          "description": this.firstform.controls["description"].value,
          "partner_id": this.firstform.controls["socio_id"].value,

        });

        this.vehiclesServices.update(this.idEdit, bodyData).subscribe(
          response => {
            this.toasTer.success(colorMsg.update);
            this.reloadComponent();
          },
          error => {
            if (error["status"] === 422) {
              this.toasTer.error(error.error.data);
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
  
          "plate": this.firstform.controls["placa"].value,
          "num_control": this.firstform.controls["numero"].value,
          "status": this.firstform.controls["tipo"].value,
          "description": this.firstform.controls["description"].value,
          "partner_id": this.firstform.controls["socio_id"].value,

        });
        this.vehiclesServices.save(bodyData).subscribe(
          response => {
            this.toasTer.success(colorMsg.save);
            this.reloadComponent();
          },
          error => {
            console.log(error)
            if (error["status"] === 422) {
              this.toasTer.error(error.error.data);
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
  /*BUSCAR SOCIO*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn4(servicio: Socios): string {
    return servicio && servicio.name ? servicio.name : '';
  }

  onSelectionChanged4(event: MatAutocompleteSelectedEvent) {
    this.idsubservicio4 = 0;
    let namesub4: string;

    const viene4 = event.option.value;
    this.idsubservicio4 = viene4.id ? viene4.id : 0;
    namesub4 = viene4.name ? viene4.name : '';
    //console.log(pla);
    this.firstform.controls['socio'].setValue(namesub4);
    this.firstform.controls['socio_id'].setValue(this.idsubservicio4);

  }

  private _filter4(name: string): Socios[] {
    const filterValue4 = name.toLowerCase();
    return this.options4.filter(option => option.name.toLowerCase().indexOf(filterValue4) === 0);
  }
}
