import { ChangeDetectorRef, Component, OnInit, EventEmitter, ViewChild,   Input,   Output, } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

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

import { Router } from "@angular/router";
import { Pipe, PipeTransform } from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MatPaginator} from '@angular/material/paginator';

import {HttpServices}from '../../../http/httpServices/httpServices'
import {ColorServices} from '../../color/color-services/color-services'
import {SubServiceServices} from '../../sub-service/sub-service-services/sub-service-services'
import {ServiceServices} from '../../service/service-services/service-services'
import {ClientServices} from '../../client/client-services/client-services'
import {BranchServices} from '../../branch/branch-services/branch-services'
import {EntradasServices} from '../entradas-services/entradas-services'
import {EntradasDeleteComponent} from '../dialog/entradas-delete/entradas-delete.component'

import {entradasMsg} from '../../../utils/const/message'
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
  selector: 'app-entradas-form',
  templateUrl: './entradas-form.component.html',
  styleUrls: ['./entradas-form.component.scss']
})
export class EntradasFormComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [ 'Nombre'];
  dataSource;
  dataSourceSucursal;
  @Input() element: string  ;
  @Output() statusCloseModal = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper;

  public firstform: FormGroup ;
  public treeFormGroup: FormGroup;
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
  secondsFormGroup: FormGroup;
  public nameButtonAceptar: string = 'Agregar';
  public idToUpdate: number;


  /*public api;
  openOptionClient: boolean = false;
  filteredOptions: Observable<string[]>;
  public disabledButoon: boolean = false;*/

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

  public flag: boolean = false;
  public colores: Array<any> = [];
 
  public totalProductos=0;
 
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
    private subServiceServices: SubServiceServices,
    private serviceServices: ServiceServices,
    public cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private http: HttpServices,
    private colorServices: ColorServices,
    private entradasServices: EntradasServices,
    private clientServices: ClientServices,
    private branchServices: BranchServices
   ) {     
      this.isLoading = true;
   }

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
        console.log(value2["data"])
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
 
  
  onSubmit(){
    this.misSubServicios="";
    if ( this.firstFormGroup.invalid  ) {
      return;
    }else{
     /* this.ifbandera = 0;
      Object.keys(this.personList).forEach(e => {
        const nacion: string = this.personList[e]["nationality"] ;
        console.log(nacion);
        
        if (nacion === '' || nacion === null) {
          this.ifbandera = this.ifbandera + 1;
           
        }else{
          Object.keys(this.options).forEach(i => {
          const opc: string = this.options[i];
          if (nacion.toLowerCase() === opc.toLowerCase()) {
            this.ifbandera = this.ifbandera + 1;
             
          }
          
          });
        }
        
      });
      if ( this.ifbandera === 0 && this.putSubmit === false){
        this.loading = false;
        this.toasTer.error('No existe nacionalidad');
      }else{*/
      /////telefono
     /* Object.keys(this.personList).forEach(i => {
        this.misSubServicios += this.personList[i]["subservicio"] + ",";
      });
      let serviciosVan = this.misSubServicios.substring(0, this.misSubServicios.length - 1);*/
     
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
            

          });
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
              this.toasTer.error('Debe agregar al menos 1 entrada');
  
            }else {
              
              let bodyData = Object.assign({
                "client_id": this.firstFormGroup.controls["client_id"].value,
                "observation": this.treeFormGroup.controls["observacion"].value,
                "branch_id": (this.secondsFormGroup.controls["sucursal_id"].value!=="") ? this.secondsFormGroup.controls["sucursal_id"].value : null ,
                "moreInputs": list
              });  
              //console.warn(bodyData);
              this.entradasServices.update(this.idEdit, bodyData).subscribe(
                response => {
                      this.toasTer.success(entradasMsg.update);
                      this.reloadComponent();
                  },
                  error => {
                    this.loading = false;
                    this.toasTer.error(entradasMsg.errorProcess);
                    this.loading = false;
                  }
                );
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
                this.toasTer.error('Debe agregar al menos 1 entrada');
    
              }else {
            let bodyData = Object.assign({
              "client_id": this.firstFormGroup.controls["client_id"].value,
              "observation": this.treeFormGroup.controls["observacion"].value,
              "branch_id": (this.secondsFormGroup.controls["sucursal_id"].value!=="") ? this.secondsFormGroup.controls["sucursal_id"].value : null ,
              "moreInputs": list
            });
            console.log(bodyData);
            this.entradasServices.save(bodyData).subscribe(
              response => {
                    this.toasTer.success(entradasMsg.save);
                    this.reloadComponent();
                },
                error => {
                  this.loading = false;
                  this.toasTer.error(entradasMsg.errorProcess);
                  this.loading = false;
                }
              );
              }
            }
          }
        } 
      //}
        
          
    }
  }
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
  this.totalProductos=0;
  this.firstFormGroup.controls['client'].setValue('0');
  this.firstFormGroup.controls['client_id'].setValue('0');
  this.secondsFormGroup.controls['sucursal'].setValue('0');
  this.secondsFormGroup.controls['sucursal_id'].setValue('0');

  this.firstFormGroup.controls['client'].setValue('');
  this.firstFormGroup.controls['client_id'].setValue('');
  this.secondsFormGroup.controls['sucursal'].setValue('');
  this.secondsFormGroup.controls['sucursal_id'].setValue('');
  this.treeFormGroup.controls["observacion"].setValue('');

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
  Object.keys(this.element).forEach(i => {
    if (this.element[i].id === id) {
      dataEdit.push(this.element[i]);
    }
  });
  console.log(dataEdit[0]);
  this.firstFormGroup.controls['client'].setValue(dataEdit[0]["client_name"]);
  this.firstFormGroup.controls['client_id'].setValue(dataEdit[0]["client_id"]);
  this.treeFormGroup.controls["observacion"].setValue(dataEdit[0]["observation"]);

  this.idsubservicio6 = dataEdit[0]["client_id"];
   /*BUSCAR sucursal*******************************/
   
   this.options7=[];
   this.branchServices.getListIdClienteSinEntrada(this.idsubservicio6)
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
if(dataEdit[0]["branch_id"]>0){
  this.vieneSucursal=true;
  this.secondsFormGroup.controls['sucursal'].setValue(dataEdit[0]["branch_name"]);
  this.secondsFormGroup.controls['sucursal_id'].setValue(dataEdit[0]["branch_id"]);
}else{
  this.vieneSucursal=false;
  this.secondsFormGroup.controls['sucursal'].setValue('');
  this.secondsFormGroup.controls['sucursal_id'].setValue('');
}
 
                Object.keys(dataEdit[0].inputs).forEach(i => {
                  this.totalProductos = this.totalProductos + dataEdit[0].inputs[i].quantity;
                
                  this.personList.push(
 
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
remove(id_list: any, id_registro: any, cantidad:any) {
   if(id_registro!==0){
    let modulo ="deleteOp";
        const dialogRef = this.dialog.open(EntradasDeleteComponent, {
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
          this.totalProductos = this.totalProductos - cantidad;
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
    this.totalProductos = this.totalProductos - cantidad;
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
  this.totalProductos = this.totalProductos + form.value.cantidad;
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
  //console.log(this.personList);
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

 