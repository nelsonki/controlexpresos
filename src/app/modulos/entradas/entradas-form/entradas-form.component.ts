import { ChangeDetectorRef, Component, OnInit, EventEmitter, ViewChild,   Input,   Output, } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
  MinLengthValidator
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {environment} from '../../../../environments/environment'
import {HttpServices}from '../../../http/httpServices/httpServices'
import {ColorServices} from '../../color/color-services/color-services'

import { Router } from "@angular/router";
import { Pipe, PipeTransform } from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {SubServiceServices} from '../../sub-service/sub-service-services/sub-service-services'
import {ServiceServices} from '../../service/service-services/service-services'
export interface Subservicio {
  id: number;
  name: string;
}
export interface Servicio {
  id: number;
  name: string;
}
@Component({
  selector: 'app-entradas-form',
  templateUrl: './entradas-form.component.html',
  styleUrls: ['./entradas-form.component.scss']
})
export class EntradasFormComponent implements OnInit {
  @Input() element: string  ;
  @Output() statusCloseModal = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper;

  public firstform: FormGroup ;
  public submitted = false;
  public loading: boolean = false;
  public editSubmit: boolean = false;
  public closeStatus: boolean = false;

  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public taskList = [];

   isLinear = false;
  public editField: string;
  public allProduct: string[] = [];
  isOptional = false;
  public ProductsList: string[] = [];
  public idEdit: any;
  public putSubmit: boolean = false;
  public isLoading;
  data: any = [];
  options: string[] = [];
  public ifbandera=0;

  firstFormGroup: FormGroup;
  myControl2: FormGroup;
  public nameButtonAceptar: string = 'Agregar';
  public idToUpdate: number;

  public api;
  openOptionClient: boolean = false;
  filteredOptions: Observable<string[]>;
  public disabledButoon: boolean = false;

  public api2;
  openOptionClient2: boolean = false;
  filteredOptions2: Observable<string[]>;
  public disabledButoon2: boolean = false;

  //buscar sub-servicio
  public filteredOptions3: Observable<Subservicio[]>;
  public options2: Array<any> = [];
  public idsubservicio = 0;

  //buscar servicio
  public filteredOptions4: Observable<Servicio[]>;
  public options4: Array<any> = [];
  public idsubservicio4 = 0;

  public colores: Array<any> = [];

 
  public tipoRopa: Array<any> = [{
    value: 'Nueva',
  },
  {
    value: 'Usada',
  },
  {
    value: 'Desmanche',
  },
   
  ];
  public personList: Array<any> = [
    {
      id: 0,
      servicio: '',
      peso: '',
      cantidad: '',
      color:  '',
      subservicio:  '',
      tipo: '',
    }
  ];
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public subServiceServices: SubServiceServices,
    public serviceServices: ServiceServices,
    public cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private http: HttpServices,
     private colorServices: ColorServices
   ) {     
      this.isLoading = true;
   }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      client: ['', [Validators.required ]],
      client_id: ['', [Validators.required ]],

      sucursal: ['', [Validators.required, Validators.minLength(2) ]],
      sucursal_id: ['', [Validators.required ]],

    });
    this.myControl2 = this.formBuilder.group({
      peso: ['', Validators.required],
      cantidad: ['' ],
      color:  ['' ],
      myControl_sub : ['', [Validators.required ]],
      myControl_ser : ['', [Validators.required ]],
      tipo:  ['' ],
     });
     this.colorServices.getList().pipe()
      .subscribe((value) => {
        
        Object.keys(value['data']).forEach(i => {
          this.colores.push(
               {
                 id: value['data'][i].id,
                 color: value['data'][i].color,
  
                }
  
          );
         
            });
 
      });
      /*BUSCAR SUB-SERVICIO*/
      this.subServiceServices.getList().pipe()
      .subscribe((value2) => {
        //console.log(value2["data"])
        Object.keys(value2["data"]).forEach(i => {
          this.options2.push(
               {
                 "id": value2["data"][i].id,
                 "name": value2["data"][i].name,
  
                }
  
          );
         
        });
      });
      this.filteredOptions3  = this.myControl2.controls['myControl_sub'].valueChanges.pipe(
        startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.options2.slice())
      );

      /*BUSCAR SERVICIO*/
      this.serviceServices.getList().pipe()
      .subscribe((value) => {
        //console.log(value["data"])
        Object.keys(value["data"]).forEach(i => {
          this.options4.push(
               {
                 "id": value["data"][i].id,
                 "name": value["data"][i].name,
  
                }
  
          );
         
        });
      });
      this.filteredOptions4  = this.myControl2.controls['myControl_ser'].valueChanges.pipe(
        startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter4(name) : this.options4.slice())
      );
  }
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
  }
  onSubmit(){}
  get f() {
    return this.firstform.controls;
  }
  updateList(id: number, property: string, event: any) {
    let editField;
    editField = event.target.value;
    this.personList[id][property] = editField;
    this.cd.detectChanges();
}
public addForm(id) {  
}  

reloadComponent() {
  const currentUrl = this.router.url;
  const refreshUrl = currentUrl.indexOf("Boardings") > -1 ? "/" : "/";
  this.router
    .navigateByUrl(refreshUrl)
    .then(() => this.router.navigateByUrl(currentUrl));
  //this.producEdit = [];
}

onAuto(){}
changeValue(id: number, property: string, event: any) {
  this.editField = event.target.value;
}
public changeSelect(id: number, property: string, event: any,  value ) {
  this.editField =  value;
}
remove(id: any) {
  this.myControl2.reset();
   this.personList.splice(id, 1);
   this.nameButtonAceptar = 'Agregar';
}

add() {
  if (!this.myControl2.valid) {
    return;
  }else{
    if (this.nameButtonAceptar === 'Agregar') {
    this.handleSubmit(this.myControl2, null );
  } else {
    this.handleSubmit(this.myControl2, this.idToUpdate);
    this.personList.splice(this.idToUpdate, 1);

  }
  }
 }
 handleSubmit(form: FormGroup, idv?: number){
  let miid;
  if ( idv == null){
    miid = 0;
  }else{
    miid = this.personList[idv].id;
  }
  let fechab;
  if (form.value.date_from === '' || form.value.date_from === null){
    fechab= '';
   }else{
    fechab =this.convertFormat(form.value.date_from)
   } 
 
  this.personList.push({ 
    id: miid,
    name: form.value.name,
    passport_number: form.value.passport_number,
    date_from: fechab,
    sex:  form.value.sex,
  });
  console.log(this.personList);
  this.clearInput();
}
 edittri(id: any) {
  let fechaboat ;
  let fechab = (this.personList[id]["date_from"] === '' || this.personList[id]["date_from"] === null ) ? '' : this.personList[id]["date_from"];
if(fechab=== '' || fechab === null){
 fechaboat = '';
}else{
 fechaboat = fechab + "T00:00:00";
}
  

  this.myControl2.controls['name'].setValue(this.personList[id]["name"]);
  this.myControl2.controls['passport_number'].setValue(this.personList[id]["passport_number"]);
  this.myControl2.controls['date_from'].setValue(fechaboat);
  this.myControl2.controls['sex'].setValue(this.personList[id]["sex"]);
  this.nameButtonAceptar = 'Editar';
  this.idToUpdate = id;
  console.log(this.personList);
}


public clearInput() {
  this.myControl2.reset();
  this.nameButtonAceptar = 'Agregar';
 
 }

convertFormat(range){
var fechaSearch;

  var fecha = new Date(range);
  var dia = fecha.getDate();
  var mes = fecha.getMonth();
  var anno = fecha.getFullYear();

  

  if((mes + 1) < 10){
      fechaSearch = anno + '-' + 0 + (mes + 1);
    }else{
      fechaSearch = anno + '-' + (mes + 1);
  }

  if(dia < 10){
      fechaSearch = fechaSearch + '-' + 0 + (dia);
    }else{
      fechaSearch = fechaSearch + '-' + (dia);
  }

    
  return fechaSearch ;

}
public asigneStepper(stepper: MatStepper) {
  this.stepper = stepper;
} 
public returnStepper(stepper: MatStepper) {
  stepper.selectedIndex = 0;
}
public goForward(stepper: MatStepper) {
  stepper.reset();
}
/*buscar cliente*/
public searchClient() {
  this.api = environment.apiJakiro2;
  let valueSearch = this.firstFormGroup.controls["client"].value;
  if (valueSearch.trim() !== "") {
    let enpoint = "clients/search/" + this.firstFormGroup.controls["client"].value;
    this.http.doGet(this.api, enpoint).subscribe((data: any) => {
      console.log(data);
      if (data.length > 0) {
        this.openOptionClient = true;
        this.filteredOptions = data;
      } else {
        this.openOptionClient = false;
        this.firstFormGroup.controls["client_id"].setValue("");
        this.firstFormGroup.controls["client"].setValue("");
      }
    });
  }
}
public setDataFormul(event, id, nombreComercial) {
  this.openOptionClient = false;
  this.firstFormGroup.controls["client_id"].setValue(id);
  this.firstFormGroup.controls["client"].setValue(nombreComercial);
}
/*buscar sucursal*//////////////////////////////////////////////////////////////////////
public searchClient2() {
  this.api2 = environment.apiJakiro2;
  let valueSearch2 = this.firstFormGroup.controls["sucursal"].value;
  if (valueSearch2.trim() !== "") {
    let enpoint = "branches/search/" + this.firstFormGroup.controls["sucursal"].value;
    this.http.doGet(this.api2, enpoint).subscribe((data: any) => {
      console.log(data);
      if (data.length > 0) {
        this.openOptionClient2 = true;
        this.filteredOptions2 = data;
      } else {
        this.openOptionClient2 = false;
        this.firstFormGroup.controls["sucursal_id"].setValue("");
        this.firstFormGroup.controls["sucursal"].setValue("");
      }
    });
  }
}
public setDataFormul2(event, id, nombreComercial) {
  this.openOptionClient2 = false;
  this.firstFormGroup.controls["sucursal_id"].setValue(id);
  this.firstFormGroup.controls["sucursal"].setValue(nombreComercial);
}
/*BUSCAR SUB-SERVICIO*/

displayFn(subservicio: Subservicio): string {
  return subservicio && subservicio.name ? subservicio.name : '';
}
onSelectionChanged(event: MatAutocompleteSelectedEvent) {
  this.idsubservicio = 0;
  let namesub:string;
  const viene = event.option.value;
  this.idsubservicio = viene.id ? viene.id : 0;
  namesub = viene.name ? viene.name : '';
  //console.log(pla);
  this.myControl2.controls['myControl_sub'].setValue(namesub);
}
private _filter(name: string): Servicio[] {
  const filterValue = name.toLowerCase();
  return this.options2.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0 );
}

/*BUSCAR SERVICIO*///////////////////////////////////////////////////////////////////////////////////////////////

displayFn4(servicio: Servicio): string {
  return servicio && servicio.name ? servicio.name : '';
}

onSelectionChanged4(event: MatAutocompleteSelectedEvent) {
  this.idsubservicio4 = 0;
  let namesub4:string;
  
  const viene4= event.option.value;
  this.idsubservicio4 = viene4.id ? viene4.id : 0;
  namesub4 = viene4.name ? viene4.name : '';
  //console.log(pla);
  this.myControl2.controls['myControl_ser'].setValue(namesub4);
  
}

private _filter4(name4: string): Servicio[] {
  const filterValue4 = name4.toLowerCase();
  return this.options4.filter(option4 => option4.name.toLowerCase().indexOf(filterValue4) === 0 );
}
}


