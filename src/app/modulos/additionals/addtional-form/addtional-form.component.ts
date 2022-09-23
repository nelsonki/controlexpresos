
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
import { map, startWith } from 'rxjs/operators';

import { ToastrService } from "ngx-toastr";
import { AdditionalsServices } from '../addtionals-services/additionals-services';
import { environment } from '../../../../environments/environment'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpServices } from '../../../http/httpServices/httpServices'
import { Observable } from "rxjs";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {CoinsServices} from '../../coins/coins-services/coins-services'
export interface Monedas {
  id: number;
  name: string;
}

@Component({
  selector: 'app-addtional-form',
  templateUrl: './addtional-form.component.html',
  styleUrls: ['./addtional-form.component.scss']
})
export class AddtionalFormComponent implements OnInit {
  @Input() element: string;
  @Output() statusCloseModal = new EventEmitter();

  public firstform: FormGroup;
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
  public validCliente: boolean = false;

  public selectedPC: any;

  //buscar moendas
  public filteredOptions4: Observable<Monedas[]>;
  public options4: Array<any> = [];
  public idsubservicio4 = 0;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    private additionalsServices: AdditionalsServices,
    private coinsServices:CoinsServices,
    public http: HttpServices
  ) { }

  ngOnInit() {
    this.firstform = this.formBuilder.group({
      description: ["", Validators.required],
      type: ["", Validators.required],
      searchPC: ["", Validators.required],
      monto: ["", Validators.required],
      moneda: ["", Validators.required],
      moneda_id: ["", ""],

    });
     /*BUSCAR TIPO DE MONEDA*/
     this.coinsServices.getList().pipe()
     .subscribe((value) => {
       console.log(value["data"])
       Object.keys(value["data"]).forEach(i => {
         this.options4.push(
           {
             "id": value["data"][i].id,
             "name": value["data"][i].name,

           }

         );

       });
     });
   this.filteredOptions4 = this.firstform.controls['moneda'].valueChanges.pipe(
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
 
    if(dataEdit[0].percent!==null){
      this.selectedPC= "Porcentaje"
      this.firstform.controls["monto"].setValue(dataEdit[0].percent);

    }else if(dataEdit[0].quantity!==null){
      this.selectedPC= "Cantidad"
      this.firstform.controls["monto"].setValue(dataEdit[0].quantity);

    }else{
      this.selectedPC= "Seleccione"
      this.firstform.controls["monto"].setValue(null);

    }
    console.log(dataEdit[0]);
    this.firstform.controls["description"].setValue(dataEdit[0]["description"]);
    this.firstform.controls["type"].setValue(dataEdit[0]["type"]);
    this.firstform.controls["searchPC"].setValue(this.selectedPC);
    this.coinsServices.getList().subscribe((value) => {
    Object.keys(value['data']).forEach(i => {
      if (value['data'][i].symbol === dataEdit[0]["coin_id"]) {
        this.firstform.controls['moneda'].setValue(value['data'][i].name);
        this.firstform.controls['moneda_id'].setValue(value['data'][i].id);    
      }
    });
  });
   
  }
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
  }
  onSubmit() {
    let porcentaje
    let cantidad
    this.submitted = true;
    if (this.firstform.invalid) {
      return;
    } else {
      console.log(this.firstform.controls["moneda_id"].value)
      if(this.firstform.controls["moneda_id"].value===""){
        this.toasTer.warning('Debe elegir un tipo de moneda valido');
        this.firstform.controls["moneda_id"].setValue("")
        this.firstform.controls["moneda"].setValue("")
        this.loading = false;
      }else{

      if( this.firstform.controls["searchPC"].value==='Porcentaje'){
        porcentaje = this.firstform.controls["monto"].value
        cantidad = null
      }else if(this.firstform.controls["searchPC"].value==='Cantidad'){
        cantidad =this.firstform.controls["monto"].value
        porcentaje=null
      }else{
        this.toasTer.warning('Debe elegir Porcentaje o Cantidad');
        this.loading = false;
        return ;
      }
      if (this.putSubmit) {
        this.loading = true;
        let bodyData = Object.assign({
          "description": this.firstform.controls["description"].value,
          "coin_id": this.firstform.controls["moneda_id"].value,
          "type": this.firstform.controls["type"].value,
          "percent":porcentaje,
          "quantity":cantidad
         }); console.warn(bodyData);

        this.additionalsServices.update(this.idEdit, bodyData).subscribe(
          response => {
            this.toasTer.success(userMsg.update);
            this.reloadComponent();
          },
          error => {
            if (error["status"] === 422) {
              this.toasTer.error(error.error.data);
              this.loading = false;

            } else {
              this.loading = false;
              this.toasTer.error(userMsg.errorProcess);
              this.loading = false;
            }
          }
        );


      }else{
        this.loading = true;

        let bodyData = Object.assign({
          "description": this.firstform.controls["description"].value,
          "coin_id": this.firstform.controls["moneda_id"].value,
          "type": this.firstform.controls["type"].value,
          "percent":porcentaje,
          "quantity":cantidad         
        }); 
          console.log(bodyData);

        this.additionalsServices.save(bodyData).subscribe(
          response => {
            this.toasTer.success(userMsg.save);
            this.reloadComponent();
          },
          error => {
            if (error["status"] === 422) {
              this.toasTer.error('Ya existe ');
              this.loading = false;

            } else {
              this.loading = false;
              this.toasTer.error(userMsg.errorProcess);
              this.loading = false;
            }
          }
        );
      }

    }
    }
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("/dashboard/partners") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
  }
  get f() {
    return this.firstform.controls;
  }
  public closeOption() {
    this.openOptionClient = false;
  }
  /*BUSCAR TIPO DE MONEDA*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn4(servicio: Monedas): string {
    return servicio && servicio.name ? servicio.name : '';
  }

  onSelectionChanged4(event: MatAutocompleteSelectedEvent) {
    this.idsubservicio4 = 0;
    let namesub4: string;

    const viene4 = event.option.value;
    this.idsubservicio4 = viene4.id ? viene4.id : 0;
    namesub4 = viene4.name ? viene4.name : '';
    //console.log(pla);
    this.firstform.controls['moneda'].setValue(namesub4);
    this.firstform.controls['moneda_id'].setValue(this.idsubservicio4);

  }

  private _filter4(name: string): Monedas[] {
    const filterValue4 = name.toLowerCase();
    return this.options4.filter(option => option.name.toLowerCase().indexOf(filterValue4) === 0);
  }
}
