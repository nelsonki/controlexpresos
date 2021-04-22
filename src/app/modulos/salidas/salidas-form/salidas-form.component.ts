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
import { MatStepper } from '@angular/material/stepper';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

//import { TemplateMsg } from "../../../utils/const/message";
import { ToastrService } from "ngx-toastr";
//import { TemplatesService } from '../templates-services/templates.service';
import {Observable} from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';

import {SubServiceServices} from '../../sub-service/sub-service-services/sub-service-services'
import {ServiceServices} from '../../service/service-services/service-services'
import {SalidasServices} from '../salidas-services/salidas-services'
import {ClientServices} from '../../client/client-services/client-services'
import {BranchServices} from '../../branch/branch-services/branch-services'

import {SalidasDeleteComponent} from '../dialog/salidas-delete/salidas-delete.component'
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
export interface Cliente {
  id: number;
  name: string;
}
export interface Branches {
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() statusCloseModal = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper;

  displayedColumns: string[] = [ 'Nombre'];
  dataSource;
  dataSourceSucursal;

  public firstFormGroup: FormGroup;
  public myControl2: FormGroup;
  public secondsFormGroup:FormGroup;
  public treeFormGroup:FormGroup;
  public submitted = false;
  public loading: boolean = false;
  public editSubmit: boolean = false;
  public closeStatus: boolean = false;
  public editField: string;
  public nameButtonAceptar: string = 'Agregar';
  public idToUpdate: number;
  public idEdit: any;
  public putSubmit: boolean = false;
  isOptional = false;
  public validForm: boolean = false;

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

  //buscar cliente
  public filteredOptions6: Observable<Cliente[]>;
  public options6: Array<any> = [];
  public idsubservicio6 = 0;
  
   //buscar branches
   public filteredOptions7: Observable<Branches[]>;
   public options7: Array<any> = [];
   public idsubservicio7 = 0;
   public vieneSucursal:boolean=false;

  readonly separatorKeysCodes2: number[] = [ENTER, COMMA];
  public visible2 = true;
  public selectable2 = true;
  public removable2 = true;
  public addOnBlur2 = true;
  public statusValidPhone: boolean = false;
  public fruits2: string[] = [];
  public fruitCtrl2 = new FormControl();
  public misSubServicios: any;

  public id_input:any;

  public colores: Array<any> = [];
  public totalPesoEntrada=0;
  public totalPesoSalida =0;
  public tipoRopa: Array<any> = [{
    value: 'nueva',
  },
  {
    value: 'usada',
  },
  {
    value: 'desmanche',
  },
   
  ];
  public personList_entradas: Array<any> = [
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
    public dialog: MatDialog,

    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public salidasServices: SalidasServices,
    private subServiceServices: SubServiceServices,
    private serviceServices: ServiceServices,
    private colorServices: ColorServices,
    private http: HttpServices,
    private clientServices: ClientServices,
    private branchServices: BranchServices
  ) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      client: ['', [Validators.required ]],
      client_id: ['', [Validators.required ]],
 
    });
    this.secondsFormGroup = this.formBuilder.group({
      
      sucursal: [''],
      sucursal_id: [''],

    });
    this.treeFormGroup = this.formBuilder.group({
      
      observacion: [''],

    });
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
      
      /*BUSCAR CLIENTE*******************************/
      this.clientServices.getListSinEntradas()
      .subscribe((value) => {
        
        Object.keys(value).forEach(i => {
          this.options6.push(
               {
                 id: value[i].id,
                 name: value[i].name,
  
                }
  
          );
          this.dataSource = new MatTableDataSource(this.options6);
          this.dataSource.paginator = this.paginator;
          return this.dataSource;
            });
 
      });
      this.filteredOptions6  = this.firstFormGroup.controls['client'].valueChanges.pipe(
        startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter6(name) : this.options6.slice())
      );
      /*BUSCAR sucursal*******************************/
   
    this.options7=[];
    this.branchServices.getListIdCliente(this.idsubservicio6)
    .subscribe((value:any) => {
       console.log(value)
       if(value.length > 0){
          this.vieneSucursal=true;
          Object.keys(value).forEach(i => {
        this.options7.push(
             {
               id: value[i].id,
               name: value[i].name,
    
              }
    
        );
        this.dataSourceSucursal = new MatTableDataSource(this.options7);
        this.dataSourceSucursal.paginator = this.paginator;
        return this.dataSourceSucursal;
          });
       }else{
        this.vieneSucursal=false;

       }
     
    
    });
      this.filteredOptions7  = this.secondsFormGroup.controls['sucursal'].valueChanges.pipe(
        startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter7(name) : this.options7.slice())
      );
  }  
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
    this.reloadComponent();
  }
  public addForm(id) { 
    this.totalPesoEntrada=0;
    this.totalPesoSalida=0;
    this.validForm=false;

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
    this.treeFormGroup.controls["observacion"].setValue('');

    var editDetail = [];
    this.idEdit = id;
    let dataEdit = [];
    this.editSubmit = true;
    this.putSubmit = true;
    this.personList_entradas = [];
    this.personList = [];
    //console.warn(this.element)
    Object.keys(this.element).forEach(i => {
      if (this.element[i].id === id) {
        dataEdit.push(this.element[i]);
      }
    });
    this.treeFormGroup.controls["observacion"].setValue(dataEdit[0]["observation"]);

    console.log(dataEdit[0]);
    this.id_input = dataEdit[0].id;
    //console.log(this.id_input);

                  Object.keys(dataEdit[0].inputs).forEach(i => {
                    
                  
                    this.personList_entradas.push(
   
                        {
                        'id': dataEdit[0].inputs[i].id,
                        'peso': dataEdit[0].inputs[i].weight,
                        'cantidad': dataEdit[0].inputs[i].quantity,
                        'servicio': dataEdit[0].inputs[i].service_name,
                        'servicio_id': dataEdit[0].inputs[i].service_id,
                        'color': (dataEdit[0].inputs[i].color_name!==null)?dataEdit[0].inputs[i].color_name:'',
                        'color_id': (dataEdit[0].inputs[i].color_id!==null)?dataEdit[0].inputs[i].color_id:'',
                        'subservicio': dataEdit[0].inputs[i].subservices_tag,
                        'tipo': dataEdit[0].inputs[i].operation_type,
                        }
                    );
                    this.totalPesoEntrada = this.totalPesoEntrada + parseFloat(dataEdit[0].inputs[i].weight);
                  });
                  Object.keys(dataEdit[0].outputs).forEach(i => {
                    
                  
                    this.personList.push(
   
                        {
                        'id': dataEdit[0].outputs[i].id,
                        'peso': dataEdit[0].outputs[i].weight,
                        'cantidad': dataEdit[0].outputs[i].quantity,
                        'servicio': dataEdit[0].outputs[i].service_name,
                        'servicio_id': dataEdit[0].outputs[i].service_id,
                        'color': (dataEdit[0].outputs[i].color_name!==null)?dataEdit[0].outputs[i].color_name:'',
                        'color_id': (dataEdit[0].outputs[i].color_id!==null)?dataEdit[0].outputs[i].color_id:'',
                        'subservicio': dataEdit[0].outputs[i].subservices_tag,
                        'tipo': dataEdit[0].outputs[i].operation_type,
                        }
                    );
                  });
               
 
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
remove(id_list: any, id_registro: any) {
  if(id_registro!==0){
   let modulo ="deleteOp";
       const dialogRef = this.dialog.open(SalidasDeleteComponent, {
        width: "450px",
        data: [id_registro, modulo, 1]
      });
      dialogRef.afterClosed().subscribe(result => {
        
       const r = result;
       console.log(r);
       if(r){
         this.myControl2.controls['myControl_ser'].setValue('');
         this.myControl2.controls['myControl_ser_id'].setValue('');
         this.myControl2.controls['peso'].setValue('');
         this.myControl2.controls['cantidad'].setValue('');
         this.myControl2.controls['myControl_color'].setValue('');
         this.myControl2.controls['myControl_color_id'].setValue('');
         this.myControl2.controls['myControl_sub'].setValue('');
         this.myControl2.controls['tipo'].setValue(''); 
         this.personList.splice(id_list, 1);
         this.nameButtonAceptar = 'Agregar';
       }
       
     });
  }else{
   this.myControl2.controls['myControl_ser'].setValue('');
   this.myControl2.controls['myControl_ser_id'].setValue('');
   this.myControl2.controls['peso'].setValue('');
   this.myControl2.controls['cantidad'].setValue('');
   this.myControl2.controls['myControl_color'].setValue('');
   this.myControl2.controls['myControl_color_id'].setValue('');
   this.myControl2.controls['myControl_sub'].setValue('');
   this.myControl2.controls['tipo'].setValue(''); 
   this.personList.splice(id_list, 1);
   this.nameButtonAceptar = 'Agregar';
  } 
}

add() {
  if (!this.myControl2.valid) {
    return;
  }else{
    if (this.nameButtonAceptar === 'Agregar') {
    this.handleSubmit(this.myControl2, null );
    
  } else {
    this.handleSubmit(this.myControl2, this.idToUpdate);
    //this.personList.splice(this.idToUpdate, 1);

  }
  }
 }
 handleSubmit(form: FormGroup, idv?: number){
   let encuentra =0;
   let encuentra2 =0;
   let miid; 
  this.misSubServicios='';
  Object.keys(this.fruits2).forEach(i => {
    this.misSubServicios += this.fruits2[i] + ",";
  });
  let serviciosVan = this.misSubServicios.substring(0, this.misSubServicios.length - 1);

  if ( idv == null){
    miid = 0;     
    for (let list of this.personList){
      if(list.servicio_id=== form.value.myControl_ser_id && list.color_id===  form.value.myControl_color_id &&  list.tipo=== form.value.tipo && list.subservicio===  serviciosVan){
        list.servicio= form.value.myControl_ser,
        list.servicio_id= form.value.myControl_ser_id,
        list.peso= list.peso + form.value.peso,
        list.cantidad= list.cantidad + form.value.cantidad,
        list.color=  form.value.myControl_color,
        list.color_id=  form.value.myControl_color_id,
        list.subservicio=  serviciosVan,
        list.tipo= form.value.tipo,
        encuentra=1;
      }
    }
    if(encuentra ==0){
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
    }
  }else{

    miid = this.personList[idv].id;
    for (let list of this.personList){
      if(list.id=== miid && list.servicio_id=== form.value.myControl_ser_id && list.color_id===  form.value.myControl_color_id &&  list.tipo=== form.value.tipo && list.subservicio===  serviciosVan){
        list.id= miid,
        list.servicio= form.value.myControl_ser,
        list.servicio_id= form.value.myControl_ser_id,
        list.peso=  form.value.peso,
        list.cantidad=  form.value.cantidad,
        list.color=  form.value.myControl_color,
        list.color_id=  form.value.myControl_color_id,
        list.subservicio=  serviciosVan,
        list.tipo= form.value.tipo,
        encuentra2=1;
      }
    }
    if(encuentra2 ==0){
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
    }
  }
  this.clearInput();
}
 edittri(id: any) {
  this.myControl2.controls['myControl_ser'].setValue(this.personList[id]["servicio"]);
  this.myControl2.controls['myControl_ser_id'].setValue(this.personList[id]["servicio_id"]);
  this.idsubservicio4 = this.personList[id]["servicio_id"];
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
  onSubmit(){
    this.totalPesoSalida=0;
    console.log(this.totalPesoEntrada)
    this.misSubServicios="";
    
     
      if (this.putSubmit) {
          
          this.loading = true;
          let listEnpti = [];
          this.loading = true;
          let list = [];
          this.loading = true;
          Object.keys(this.personList).forEach(e => {
            if(this.personList[e]["id"] === 0){              
              list.push({
                id: 0,
                service_id: this.personList[e]["servicio_id"],
                weight: (this.personList[e]["peso"]!=='')?this.personList[e]["peso"]:0,
                quantity: (this.personList[e]["cantidad"]!=='')?this.personList[e]["cantidad"]:0,
                color_id:  (this.personList[e]["color_id"]!=='')?this.personList[e]["color_id"]:null,
                subservice_id:  (this.personList[e]["subservicio"]!=='')?this.personList[e]["subservicio"]:'',
                operation_type: this.personList[e]["tipo"],
                 
              });
            }else{             
              list.push({    
                id: this.personList[e]["id"],
                service_id: this.personList[e]["servicio_id"],
                weight: (this.personList[e]["peso"]!=='')?this.personList[e]["peso"]:0,
                quantity: (this.personList[e]["cantidad"]!=='')?this.personList[e]["cantidad"]:0,
                color_id:  (this.personList[e]["color_id"]!=='')?this.personList[e]["color_id"]:null,
                subservice_id:  (this.personList[e]["subservicio"]!=='')?this.personList[e]["subservicio"]:'',
                operation_type: this.personList[e]["tipo"],
                 
              });
            }
            this.totalPesoSalida= this.totalPesoSalida +  parseFloat(this.personList[e]["peso"]);

          });
          console.log(this.totalPesoSalida)

          listEnpti = list.filter(function (n) { 
            let value1 = n.service_id;
            return value1 === ""  ;
          });
          if (listEnpti.length > 0) {
            this.loading = false;
            this.toasTer.error('No puede guardar campo vacios');
  
          }else {
            if (this.personList.length === 0) {
              this.loading = false;
              this.toasTer.error('Debe agregar al menos 1 salida');
  
            }else {
              if (this.totalPesoSalida>this.totalPesoEntrada) {
                this.toasTer.error('La salida no se puede guardar porque tiene peso mayor a la entrada');
                this.loading = false;

              }else{
              let bodyData = Object.assign({
                "observation": this.treeFormGroup.controls["observacion"].value,
                "moreOutputs": list
              });  
              console.warn(bodyData);
              this.salidasServices.update(this.id_input, bodyData).subscribe(
                response => {
                      this.toasTer.success(SalidasMsg.update);
                      this.reloadComponent();
                  },
                  error => {
                     
                      this.loading = false;
                      this.toasTer.error(SalidasMsg.errorProcess);
                      this.loading = false;
                    
                    
                  }
                );

                }
              }
          }
  
      }else{
        if (this.firstFormGroup.invalid) {
          return;
        } else {
          let listEnpti = [];
          this.loading = true;
          let list = [];
          this.loading = true;
          Object.keys(this.personList).forEach(e => {
             
            list.push({
               
                service_id: this.personList[e]["servicio_id"],
                weight: (this.personList[e]["peso"]!=='')?this.personList[e]["peso"]:0,
                quantity: (this.personList[e]["cantidad"]!=='')?this.personList[e]["cantidad"]:0,
                color_id:  (this.personList[e]["color_id"]!=='')?this.personList[e]["color_id"]:null,
                subservice_id:  (this.personList[e]["subservicio"]!=='')?this.personList[e]["subservicio"]:'',
                operation_type: this.personList[e]["tipo"],
               
            });
 
          });
          listEnpti = list.filter(function (n) {
            let value1 = n.service_id;
            let value2 = n.subservice_id;
           
            return value1 === "" ;
          });
          if (listEnpti.length > 0) {
            this.loading = false;
            this.toasTer.error('No puede guardar campo vacios');

          }else {
            if (this.personList.length === 0) {
              this.loading = false;
              this.toasTer.error('Debe agregar al menos 1 salida');
  
            }else {
               
                  let bodyData = Object.assign({
                    "client_id": this.firstFormGroup.controls["client_id"].value,
                    "observation": this.treeFormGroup.controls["observacion"].value,
                    "branch_id": (this.secondsFormGroup.controls["sucursal_id"].value!=="") ? this.secondsFormGroup.controls["sucursal_id"].value : null ,
                    "foo": list
                  });
                  console.log(bodyData);
                  this.salidasServices.save(bodyData).subscribe(
                    response => {
                          this.toasTer.success(SalidasMsg.save);
                          this.reloadComponent();
                      },
                      error => {
                         
                          this.loading = false;
                          this.toasTer.error(SalidasMsg.errorProcess);
                          this.loading = false;
                         
                        
                      }
                    );
            
            }
          }
        }
      }
        
          
    
  }
  get f() {
    return this.myControl2.controls;
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
  public goNext(stepper: MatStepper) {
    stepper.next();
  }
  goBack(stepper: MatStepper){
    stepper.previous();
  }
/*BUSCAR CLIENTE*///////////////////////////////////////////////////////////////////////////////////////////////

displayFn6(cliente: Cliente): string {
  return cliente && cliente.name ? cliente.name : '';
}

onSelectionChanged6(event: MatAutocompleteSelectedEvent) {
  this.idsubservicio6 = 0;
  let namesub6:string;
  const viene6= event.option.value;
  this.idsubservicio6 = viene6.id ? viene6.id : 0;
  namesub6 = viene6.name ? viene6.name : '';
  //console.log(pla);
  this.firstFormGroup.controls['client'].setValue(namesub6);
  this.firstFormGroup.controls['client_id'].setValue(this.idsubservicio6);

  this.secondsFormGroup.controls['sucursal'].setValue('');
  this.secondsFormGroup.controls['sucursal_id'].setValue('');
  this.options7=[];
  if(this.idsubservicio6 !==0){
   
     /*BUSCAR sucursal*******************************/
   this.branchServices.getListIdClienteSinEntrada(this.idsubservicio6)
    .subscribe((value: any) => {
      console.log(value)
      if(value.length > 0){
      this.vieneSucursal=true;
      
      Object.keys(value).forEach(i => {
        
        this.options7.push(
             {
               id: value[i].id,
               name: value[i].name,
    
              }
    
        );
        this.dataSourceSucursal = new MatTableDataSource(this.options7);
        this.dataSourceSucursal.paginator = this.paginator;
        return this.dataSourceSucursal;
          });
      }else{
         
        this.vieneSucursal=false;
      }
     

    
    });
    this.filteredOptions7  = this.secondsFormGroup.controls['sucursal'].valueChanges.pipe(
      startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter7(name) : this.options7.slice())
    );
  }else{
    this.options7=[];
    this.vieneSucursal=false;
  }
  this.goNext(this.stepper)

}

private _filter6(name: string): Cliente[] {
  const filterValue6 = name.toLowerCase();
  return this.options6.filter(option => option.name.toLowerCase().indexOf(filterValue6) === 0 );
}
 /*BUSCAR SUCURSALES*///////////////////////////////////////////////////////////////////////////////////////////////

displayFn7(branches: Branches): string {
  return branches && branches.name ? branches.name : '';
}

onSelectionChanged7(event: MatAutocompleteSelectedEvent) {
  this.idsubservicio7 = 0;
  let namesub7:string;
  
  const viene7= event.option.value;
  this.idsubservicio7 = viene7.id ? viene7.id : 0;
  namesub7 = viene7.name ? viene7.name : '';
  //console.log(pla);
  this.secondsFormGroup.controls['sucursal'].setValue(namesub7);
  this.secondsFormGroup.controls['sucursal_id'].setValue(this.idsubservicio7);
  this.goNext(this.stepper)
}

private _filter7(name: string): Branches[] {
  const filterValue7 = name.toLowerCase();
  return this.options7.filter(option => option.name.toLowerCase().indexOf(filterValue7) === 0 );
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
  console.warn(viene5)
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

public validarVacio(filterValue: string){
  const text= filterValue;
  if(text ===''){
    this.myControl2.controls['myControl_color'].setValue('');
    this.myControl2.controls['myControl_color_id'].setValue('');
  }
  
}
 
//////////////////////////////////////////TABLA Y SELECTOR DE CLIENTES/////////////////////////////////
public selectUsers(event: any, options6: any) {
  this.idsubservicio6 = 0;
 this.idsubservicio6 = options6.id ? options6.id : 0;

 this.firstFormGroup.controls['client'].setValue(options6.name);
 this.firstFormGroup.controls['client_id'].setValue(this.idsubservicio6);
 this.secondsFormGroup.controls['sucursal'].setValue('');
 this.secondsFormGroup.controls['sucursal_id'].setValue('');
 this.options7=[];
 if(this.idsubservicio6 !==0){
  
    /*BUSCAR sucursal*******************************/
  this.branchServices.getListIdClienteSinEntrada(this.idsubservicio6)
   .subscribe((value: any) => {
      if(value.length > 0){
     this.vieneSucursal=true;
     
     Object.keys(value).forEach(i => {
       
       this.options7.push(
            {
              id: value[i].id,
              name: value[i].name,
   
             }
   
       );
       this.dataSourceSucursal = new MatTableDataSource(this.options7);
       this.dataSourceSucursal.paginator = this.paginator;
       return this.dataSourceSucursal;
         });
     }else{
        
       this.vieneSucursal=false;
     }
    

   
   });
   this.filteredOptions7  = this.secondsFormGroup.controls['sucursal'].valueChanges.pipe(
     startWith(''),
       map(value => typeof value === 'string' ? value : value.name),
       map(name => name ? this._filter7(name) : this.options7.slice())
   );
 }else{
   this.options7=[];
   this.vieneSucursal=false;
 }
 //user.flag = !user.flag;
 
 this.goNext(this.stepper)
}
    /*BUSCAR sucursal*******************************/

public selectSucursal(event: any, options7: any) {
 this.idsubservicio7 = 0;
 this.idsubservicio7 = options7.id ? options7.id : 0;
 this.secondsFormGroup.controls['sucursal'].setValue(options7.name);
 this.secondsFormGroup.controls['sucursal_id'].setValue(this.idsubservicio7);
 this.goNext(this.stepper)
}
}
