import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
//import { TemplateMsg } from "../../../utils/const/message";
import { ToastrService } from "ngx-toastr";
//import { TemplatesService } from '../templates-services/templates.service';
import {Observable} from 'rxjs';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';

import {SubServiceServices} from '../../sub-service/sub-service-services/sub-service-services'
import {ServiceServices} from '../../service/service-services/service-services'
import {SalidasServices} from '../salidas-services/salidas-services'
import {environment} from '../../../../environments/environment'
import {HttpServices}from '../../../http/httpServices/httpServices'
import {ColorServices} from '../../color/color-services/color-services'

import {SalidasMsg} from '../../../utils/const/message'

export interface Subservicio {
  id: number;
  name: string;
}
export interface Servicio {
  id: number;
  name: string;
}
export interface Color {
  id: number;
  name: string;
}
@Component({
  selector: 'app-salidas-form',
  templateUrl: './salidas-form.component.html',
  styleUrls: ['./salidas-form.component.scss']
})
export class SalidasFormComponent implements OnInit {
  @Input() element: string  ;
  @Output() statusCloseModal = new EventEmitter();
  
  myControl2: FormGroup;
  public submitted = false;
  public loading: boolean = false;
  public editSubmit: boolean = false;
  public closeStatus: boolean = false;
  public editField: string;
  public nameButtonAceptar: string = 'Agregar';
  public idToUpdate: number;
  public idEdit: any;
  public putSubmit: boolean = false;

  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public taskList = [];


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

  //buscar color
  public filteredOptions5: Observable<Color[]>;
  public options5: Array<any> = [];
  public idsubservicio5 = 0;

  readonly separatorKeysCodes2: number[] = [ENTER, COMMA];
  public visible2 = true;
  public selectable2 = true;
  public removable2 = true;
  public addOnBlur2 = true;
  public statusValidPhone: boolean = false;
  public fruits2: string[] = [];
  public fruitCtrl2 = new FormControl();
  public misSubServicios: any;

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
      servicio_id: '',
      peso: '',
      cantidad: '',
      color:  '',
      color_id:'',
      subservicio:  [],
      //subservicio_id:  '',
      tipo: '',
    }
  ];
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public salidasServices: SalidasServices,
    private subServiceServices: SubServiceServices,
    private serviceServices: ServiceServices,
    private colorServices: ColorServices,
    private http: HttpServices,

  ) { }

  ngOnInit() {
    this.myControl2 = this.formBuilder.group({
      peso: [''],
      cantidad: ['' ],
      myControl_color:  ['' ],
      myControl_color_id:  ['' ],

      myControl_sub : [''],

      myControl_ser : ['', [Validators.required ]],
      myControl_ser_id : ['', [Validators.required ]],

      tipo:  ['',  [Validators.required ] ],
      fruitCtrl2: [""],
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
      /*BUSCAR COLOR*/
      this.colorServices.getList().pipe()
      .subscribe((value) => {
        
        Object.keys(value['data']).forEach(i => {
          this.options5.push(
               {
                 id: value['data'][i].id,
                 name: value['data'][i].color,
  
                }
  
          );
         
            });
 
      });
      this.filteredOptions5  = this.myControl2.controls['myControl_color'].valueChanges.pipe(
        startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter5(name) : this.options5.slice())
      );
  }
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
  }
  public addForm(id) { 
    
    this.myControl2.controls['myControl_ser'].setValue('');
    this.myControl2.controls['myControl_ser_id'].setValue('');
    this.myControl2.controls['peso'].setValue('');
    this.myControl2.controls['cantidad'].setValue('');
    this.myControl2.controls['myControl_color'].setValue('');
    this.myControl2.controls['myControl_color_id'].setValue('');
    this.myControl2.controls['myControl_sub'].setValue('');
    this.myControl2.controls['tipo'].setValue('');
    this.nameButtonAceptar = 'Agregar';
    this.fruits2=[];
    this.myControl2.controls["fruitCtrl2"].setValue('');
  
    var editDetail = [];
    this.idEdit = id;
    let dataEdit = [];
    this.editSubmit = true;
    this.putSubmit = true;
    this.personList = [];
    //console.warn(this.element)
   /* Object.keys(this.element).forEach(i => {
      if (this.element[i].id === id) {
        dataEdit.push(this.element[i]);
      }
    });
    console.log(dataEdit[0]);
    
     
                  Object.keys(dataEdit[0].inputs).forEach(i => {
                    
                  
                    this.personList.push(
   
                        {
                        'id': dataEdit[0].inputs[i].id,
                        'peso': dataEdit[0].inputs[i].weight,
                        'cantidad': dataEdit[0].inputs[i].quantity,
                        'servicio': dataEdit[0].inputs[i].service_name,
                        'servicio_id': dataEdit[0].inputs[i].service_id,
                        'color': dataEdit[0].inputs[i].color_name,
                        'color_id': dataEdit[0].inputs[i].color_id,
                        'subservicio': dataEdit[0].inputs[i].subservices_tag,
                        'tipo': dataEdit[0].inputs[i].operation_type,
                        }
                    );
                      });*/
               
 
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
  this.myControl2.controls['myControl_ser'].setValue('');
  this.myControl2.controls['myControl_ser_id'].setValue('');
  this.myControl2.controls['peso'].setValue('');
  this.myControl2.controls['cantidad'].setValue('');
  this.myControl2.controls['color'].setValue('');
  this.myControl2.controls['myControl_sub'].setValue('');
  this.myControl2.controls['myControl_sub_id'].setValue('');
  this.myControl2.controls['tipo'].setValue(''); 
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
  this.misSubServicios='';
  Object.keys(this.fruits2).forEach(i => {
    this.misSubServicios += this.fruits2[i] + ",";
  });
  let serviciosVan = this.misSubServicios.substring(0, this.misSubServicios.length - 1);
   
  this.personList.push({ 
    id: miid,
    servicio: form.value.myControl_ser,
    servicio_id: form.value.myControl_ser_id,
    peso: form.value.peso,
    cantidad: form.value.cantidad,
    color:  form.value.myControl_color,
    color_id:  form.value.myControl_color_id,
    subservicio:  serviciosVan,
    tipo: form.value.tipo,
  });
  console.log(this.personList);
  this.clearInput();
}
 edittri(id: any) {
  this.myControl2.controls['myControl_ser'].setValue(this.personList[id]["servicio"]);
  this.myControl2.controls['myControl_ser_id'].setValue(this.personList[id]["servicio_id"]);
  this.myControl2.controls['peso'].setValue(this.personList[id]["peso"]);
  this.myControl2.controls['cantidad'].setValue(this.personList[id]["cantidad"]);
  this.myControl2.controls['myControl_color'].setValue(this.personList[id]["color"]);
  this.myControl2.controls['myControl_color_id'].setValue(this.personList[id]["color_id"]);
  this.myControl2.controls['tipo'].setValue(this.personList[id]["tipo"]);
  let ss = (this.personList[id]["subservicio"])? this.personList[id]["subservicio"].split(","): "";
  this.fruits2 = (ss !== "") ? ss : [];
  this.myControl2.controls["fruitCtrl2"].setValue(this.fruits2);
  this.nameButtonAceptar = 'Editar';
  this.idToUpdate = id;
  console.log(this.personList);
}


public clearInput() {
   /*this.myControl2.reset();*/
   this.myControl2.controls['myControl_ser'].setValue('');
   this.myControl2.controls['myControl_ser_id'].setValue('');
   this.myControl2.controls['peso'].setValue('');
   this.myControl2.controls['cantidad'].setValue('');
   this.myControl2.controls['myControl_color'].setValue('');
   this.myControl2.controls['myControl_color_id'].setValue('');
   this.myControl2.controls['myControl_sub'].setValue('');
   this.myControl2.controls['tipo'].setValue('');
   this.nameButtonAceptar = 'Agregar';
   this.fruits2=[];
   this.myControl2.controls["fruitCtrl2"].setValue('');
 
}
  onSubmit(){}
  get f() {
    return this.myControl2.controls;
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
  this.myControl2.controls['myControl_sub'].setValue('');
  this.buscarSubServicio(namesub)
  this.fruits2.push(namesub);

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
  this.myControl2.controls['myControl_ser_id'].setValue(this.idsubservicio4);

}

private _filter4(name: string): Servicio[] {
  const filterValue4 = name.toLowerCase();
  return this.options4.filter(option => option.name.toLowerCase().indexOf(filterValue4) === 0 );
}
/*BUSCAR COLOR*///////////////////////////////////////////////////////////////////////////////////////////////

displayFn5(color: Color): string {
  return color && color.name ? color.name : '';
}

onSelectionChanged5(event: MatAutocompleteSelectedEvent) {
  this.idsubservicio5 = 0;
  let namesub5:string;
  
  const viene5= event.option.value;
  this.idsubservicio5 = viene5.id ? viene5.id : 0;
  namesub5 = viene5.name ? viene5.name : '';
  //console.log(pla);
  this.myControl2.controls['myControl_color'].setValue(namesub5);
  this.myControl2.controls['myControl_color_id'].setValue(this.idsubservicio5);

}

private _filter5(name: string): Servicio[] {
  const filterValue5 = name.toLowerCase();
  return this.options5.filter(option => option.name.toLowerCase().indexOf(filterValue5) === 0 );
}
/////////////////////remover subservicios seleccionados tipo etiquetas
buscarSubServicio(fruit2: string): void {
  const index = this.fruits2.indexOf(fruit2);
  if (index >= 0) {
      this.fruits2.splice(index, 1);
  }
  this.myControl2.controls["fruitCtrl2"].setValue(this.fruits2);
}

removePhone(fruit2: string): void {
  const index = this.fruits2.indexOf(fruit2);
  if (index >= 0) {
      this.fruits2.splice(index, 1);
  }
  this.myControl2.controls["fruitCtrl2"].setValue(this.fruits2);
}

 
}
