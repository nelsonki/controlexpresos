
import { ChangeDetectorRef, Component, OnInit, EventEmitter, ViewChild, Input, Output, } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
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
import { environment } from '../../../../environments/environment'
import { Router } from "@angular/router";
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatPaginator } from '@angular/material/paginator';

import { HttpServices } from '../../../http/httpServices/httpServices'
import { ColorServices } from '../../color/color-services/color-services'
import { SubServiceServices } from '../../sub-service/sub-service-services/sub-service-services'
import { ServiceServices } from '../../service/service-services/service-services'
import { LiquidationsServices } from '../../liquidations/liquidations-services/liquidations-services'
import { BranchServices } from '../../branch/branch-services/branch-services'
import { LiquidationsDeleteComponent } from '../dialog/liquidations-delete/liquidations-delete.component'
import { OfficesServices } from './../../offices/offices-services/offices-services'
import { VehiclesServices } from './../../vehicles/vehicles-services/vehicles-services'
import { entradasMsg } from '../../../utils/const/message'
import { CoinsServices } from './../../coins/coins-services/coins-services'
import { AdditionalsServices } from './../../additionals/addtionals-services/additionals-services'
export interface Subservicio {
  id: number;
  name: string;
}
export interface Gastos {
  id: number;
  name: string;
}
export interface Oficina {
  id: number;
  name: string;
}

export interface Vehiculo {
  id: number;
  name: string;
}
export interface Moneda {
  id: number;
  name: string;
}
@Component({
  selector: 'app-liquidations-form',
  templateUrl: './liquidations-form.component.html',
  styleUrls: ['./liquidations-form.component.scss']
})
export class LiquidationsFormComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Nombre', 'Placa', 'Descripción'];
  dataSource;
  dataSourceSucursal;
  @Input() element: string;
  @Output() statusCloseModal = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper;


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
  public ifbandera = 0;

  treeFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  myControl2: FormGroup;
  fourFormGroup: FormGroup;

  public nameButtonAceptar: string = 'Agregar';
  public idToUpdate: number;

  public nameButtonAceptar2: string = 'Agregar';
  public idToUpdate2: number;

  /*public api;
  openOptionClient: boolean = false;
  filteredOptions: Observable<string[]>;
  public disabledButoon: boolean = false;*/

  public api2;
  openOptionClient2: boolean = false;
  filteredOptions2: Observable<string[]>;
  public disabledButoon2: boolean = false;

  //buscar gastos
  public filteredOptions8: Observable<Gastos[]>;
  public options8: Array<any> = [];
  public idsubgastos8 = 0;

  //buscar monto
  public filteredOptions9: Observable<Moneda[]>;
  public options9: Array<any> = [];
  public idsubmonto9 = 0;

  //buscar moneda
  public filteredOptions7: Observable<Moneda[]>;
  public options7: Array<any> = [];
  public idsubmoneda7 = 0;

  //buscar Oficinas
  public filteredOptions4: Observable<Oficina[]>;
  public options4: Array<any> = [];
  public idsubservicio4 = 0;

  //buscar Oficina de llegada
  public filteredOptions5: Observable<Oficina[]>;
  public options5: Array<any> = [];
  public idsubservicio5 = 0;

  //buscar vehículo
  public filteredOptions6: Observable<Vehiculo[]>;
  public options6: Array<any> = [];
  public idsubservicio6 = 0;


  readonly separatorKeysCodes2: number[] = [ENTER, COMMA];
  public visible2 = true;
  public selectable2 = true;
  public removable2 = true;
  public addOnBlur2 = true;
  public statusValidPhone: boolean = false;
  public fruits2: string[] = [];
  public misSubServicios: any;

  public flag: boolean = false;
  public colores: Array<any> = [];


  public tipoViaje: Array<any> = [{
    value: 'Salida',
  },
  {
    value: 'Llegada',
  },


  ];

  public personList: Array<any> = [
    {
      id_gasto: 0,
      name: '',
      percent: '',
      quantity: '',
      type: '',
      coin: ''

    }
  ];
  public personListMontos: Array<any> = [
    {
      id_coin: 0,
      name: '',
      monto: '',


    }
  ];
  changed: Date;

  constructor(

    private formBuilder: FormBuilder,
    public router: Router,
    public toasTer: ToastrService,
    public cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private http: HttpServices,
    private liquidationsServices: LiquidationsServices,
    private vehiclesServices: VehiclesServices,
    private officesServices: OfficesServices,
    private coinsServices: CoinsServices,
    private additionalsServices: AdditionalsServices
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      vehiculo: ['', [Validators.required]],
      vehiculo_id: ['', [Validators.required]],


    });


    this.myControl2 = this.formBuilder.group({
      precio: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],

      myControl_coin: ['', [Validators.required]],
      myControl_coin_id: [''],


      myControl_ofi_ini: ['', [Validators.required]],
      myControl_ofi_ini_id: [''],

      myControl_ofi_fin: ['', [Validators.required]],
      myControl_ofi_fin_id: [''],

      tipo: ['Salida'],
      fecha: ["", [Validators.required]],


    });

    this.treeFormGroup = this.formBuilder.group({


      myControl_gasto: [''],
      myControl_gasto_id: [''],
      myControl_tipo: [''],
      myControl_porcentaje: [0],
      myControl_cantidad: [0],
      myControl_moneda: [''],


    });
    this.fourFormGroup = this.formBuilder.group({


      myControl_coinRecibe: ['', [Validators.required]],
      myControl_coinRecibe_id: [''],
      myControl_monto: [, [Validators.required]],


    });
    /*BUSCAR MONTO*/
    this.coinsServices.getList().pipe()
      .subscribe((value) => {
        Object.keys(value["data"]).forEach(i => {
          this.options9.push(
            {
              "id": value["data"][i].id,
              "name": value["data"][i].name,

            }

          );

        });
      });
    this.filteredOptions9 = this.fourFormGroup.controls['myControl_coinRecibe'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter9(name) : this.options9.slice())
    );
    /*BUSCAR gastos*/
    this.additionalsServices.getList().pipe()
      .subscribe((value) => {
        Object.keys(value["data"]).forEach(i => {
          this.options8.push(
            {
              "id": value["data"][i].id,
              "name": value["data"][i].description,
              "percent": value["data"][i].percent,
              "quantity": value["data"][i].quantity,
              "type": value["data"][i].type,
              "coin": value["data"][i].coin.symbol,

            }

          );

        });
      });
    this.filteredOptions8 = this.treeFormGroup.controls['myControl_gasto'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter8(name) : this.options8.slice())
    );
    /*BUSCAR MONEDA*/
    this.coinsServices.getList().pipe()
      .subscribe((value) => {
        Object.keys(value["data"]).forEach(i => {
          this.options7.push(
            {
              "id": value["data"][i].id,
              "name": value["data"][i].name,

            }

          );

        });
      });
    this.filteredOptions7 = this.myControl2.controls['myControl_coin'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter7(name) : this.options7.slice())
    );
    /*BUSCAR oficina inicio*/
    this.officesServices.getList().pipe()
      .subscribe((value) => {
        Object.keys(value["data"]).forEach(i => {
          this.options4.push(
            {
              "id": value["data"][i].id,
              "name": value["data"][i].name,

            }

          );

        });
      });
    this.filteredOptions4 = this.myControl2.controls['myControl_ofi_ini'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter4(name) : this.options4.slice())
    );
    /*BUSCAR oficina llegada*/
    this.officesServices.getList().pipe()
      .subscribe((value) => {

        Object.keys(value['data']).forEach(i => {
          this.options5.push(
            {
              id: value['data'][i].id,
              name: value['data'][i].name,

            }

          );

        });

      });
    this.filteredOptions5 = this.myControl2.controls['myControl_ofi_fin'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter5(name) : this.options5.slice())
    );

    /*BUSCAR CLIENTE*******************************/
    this.vehiclesServices.getList()
      .subscribe((value) => {
        Object.keys(value['data']).forEach(i => {
          this.options6.push(
            {
              id: value['data'][i].id,
              name: value['data'][i].num_control,
              plate: value['data'][i].plate,
              description: value['data'][i].description,

            }

          );

        });
        this.dataSource = new MatTableDataSource(this.options6);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      });
    this.filteredOptions6 = this.firstFormGroup.controls['vehiculo'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter6(name) : this.options6.slice())
    );



  }
  public closeModal() {
    this.closeStatus = !this.closeStatus;
    this.statusCloseModal.emit(this.closeStatus);
    this.reloadComponent();
  }
  onSubmit() {
    if (this.firstFormGroup.invalid) {
      return;
    } else {

      if (this.putSubmit) {

        this.loading = true;
        let listEnpti = [];
        let list = [];
        let listEnpti2 = [];
        let list2 = [];
        Object.keys(this.personList).forEach(e => {

          list.push(
            this.personList[e]["id_gasto"],

          );


        });
        Object.keys(this.personListMontos).forEach(e => {

          list2.push({
            "coin_id": this.personList[e]["id_coin"],
            "quantity": this.fourFormGroup.controls['myControl_monto'].value
          }
          );


        });
        listEnpti = list.filter(function (n) {
          let value1 = n.id_gasto;
          return value1 === "";
        });
        listEnpti2 = list2.filter(function (n) {
          let value1 = n.id_gasto;
          return value1 === "";
        });
        if (listEnpti.length > 0 || listEnpti2.length > 0) {
          this.loading = false;
          this.toasTer.error('No puede guardar campo vacios');

        } else {
          if (this.personList.length === 0 || this.personListMontos.length === 0) {
            this.loading = false;
            this.toasTer.error('Debe agregar al menos 1 operación');

          } else {

            let bodyData = Object.assign({
              "type_travel": this.myControl2.controls["tipo"].value,
              "vehicle_id": this.firstFormGroup.controls["vehiculo_id"].value,
              "precio_pasaje": this.myControl2.controls["precio"].value,
              "coin_id": this.myControl2.controls["myControl_coin_id"].value,
              "date": this.myControl2.controls["fecha"].value,
              "pasajeros": this.myControl2.controls["cantidad"].value,
              "falta": 0,
              "office_origin": this.myControl2.controls["myControl_ofi_ini_id"].value,
              "office_destiny": this.myControl2.controls["myControl_ofi_fin_id"].value,
              "additionals": list,
              "ammounts": list2
            });
            console.warn(bodyData);
            /*
           this.liquidationsServices.update(this.idEdit, bodyData).subscribe(
             response => {
               this.toasTer.success(entradasMsg.update);
               this.reloadComponent();
             },
             error => {
               this.loading = false;
               this.toasTer.error(entradasMsg.errorProcess);
               this.loading = false;
             });*/
          }
        }

      } else {
        if (this.firstFormGroup.invalid) {
          return;
        } else {
          this.loading = true;
          let listEnpti = [];
          let list = [];
          let listEnpti2 = [];
          let list2 = [];
          Object.keys(this.personList).forEach(e => {

            list.push(

              this.personList[e]["id_gasto"],


            );
          });
          Object.keys(this.personListMontos).forEach(e => {

            list2.push({
              "coin_id": this.personListMontos[e]["id_coin"],
              "quantity": this.personListMontos[e]["monto"]
            }
            );


          });
          listEnpti = list.filter(function (n) {
            let value1 = n.id_gasto;

            return value1 === "";
          });
          listEnpti2 = list2.filter(function (n) {
            let value1 = n.id_gasto;
            return value1 === "";
          });
          if (listEnpti.length > 0 || listEnpti2.length > 0) {
            this.loading = false;
            this.toasTer.error('No puede guardar campo vacios');

          } else {
            if (this.personList.length === 0 || this.personListMontos.length === 0) {
              this.loading = false;
              this.toasTer.error('Debe agregar al menos 1 operación');

            } else {
              let bodyData = Object.assign({
                "type_travel": this.myControl2.controls["tipo"].value,
                "vehicle_id": this.firstFormGroup.controls["vehiculo_id"].value,
                "precio_pasaje": this.myControl2.controls["precio"].value,
                "coin_id": this.myControl2.controls["myControl_coin_id"].value,
                "date": this.myControl2.controls["fecha"].value,
                "pasajeros": this.myControl2.controls["cantidad"].value,
                "falta": 0,
                "office_origin": this.myControl2.controls["myControl_ofi_ini_id"].value,
                "office_destiny": this.myControl2.controls["myControl_ofi_fin_id"].value,
                "additionals": list,
                "ammounts": list2
              });
              console.log(bodyData);
              this.liquidationsServices.save(bodyData).subscribe(
                response => {
                  this.toasTer.success(entradasMsg.save);
                  this.reloadComponent();
                },
                error => {
                  if (error["status"] === 415) {
                    this.toasTer.error(error.error.data);
                    this.loading = false;

                  } else {
                    this.loading = false;
                    this.toasTer.error(error.error.data);
                    this.loading = false;
                  }
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
    return this.firstFormGroup.controls;
  }
  get c() {
    return this.myControl2.controls;
  }
  get t() {
    return this.treeFormGroup.controls;
  }
  get f4() {
    return this.fourFormGroup.controls;
  }
  public addForm(idLiquidacion, idViaje) {
    this.firstFormGroup.controls['vehiculo'].setValue('0');
    this.firstFormGroup.controls['vehiculo_id'].setValue('0');


    this.myControl2.controls['myControl_ofi_ini'].setValue('');
    this.myControl2.controls['myControl_ofi_ini_id'].setValue('');
    this.myControl2.controls['myControl_ofi_fin'].setValue('');
    this.myControl2.controls['myControl_ofi_fin_id'].setValue('');
    this.myControl2.controls['precio'].setValue('');
    this.myControl2.controls['cantidad'].setValue('');
    this.myControl2.controls['tipo'].setValue('');
    this.myControl2.controls['fecha'].setValue('');

    this.nameButtonAceptar = 'Agregar';
    this.treeFormGroup.controls["myControl_gasto"].setValue('');
    this.treeFormGroup.controls["myControl_gasto_id"].setValue('');
    this.treeFormGroup.controls["myControl_tipo"].setValue('');
    this.treeFormGroup.controls["myControl_porcentaje"].setValue(0);
    this.treeFormGroup.controls["myControl_cantidad"].setValue(0);
    this.treeFormGroup.controls["myControl_moneda"].setValue('');

    var editDetail = [];
    this.idEdit = idViaje;
    let dataEdit = [];
    this.editSubmit = true;
    this.putSubmit = true;
    this.personList = [];
    Object.keys(this.element).forEach(i => {
      if (this.element[i].id === idViaje) {
        dataEdit.push(this.element[i]);
      }
    });
    this.firstFormGroup.controls['vehiculo'].setValue(dataEdit[0]["vehicle"]);
    this.firstFormGroup.controls['vehiculo_id'].setValue(dataEdit[0]["vehicle_id"]);




    Object.keys(dataEdit[0].liquidations).forEach(j => {
      if (dataEdit[0].liquidations[j].id === idLiquidacion) {
        this.myControl2.controls['myControl_ofi_ini'].setValue(dataEdit[0].liquidations[j].name_office_origin);
        this.myControl2.controls['myControl_ofi_ini_id'].setValue(dataEdit[0].liquidations[j].office_origin);
        this.myControl2.controls['myControl_ofi_fin'].setValue(dataEdit[0].liquidations[j].name_office_destiny);
        this.myControl2.controls['myControl_ofi_fin_id'].setValue(dataEdit[0].liquidations[j].office_destiny);
        this.myControl2.controls['precio'].setValue(dataEdit[0].liquidations[j].precio_pasaje);
        this.myControl2.controls['cantidad'].setValue(dataEdit[0].liquidations[j].pasajeros);

        this.myControl2.controls['tipo'].setValue(dataEdit[0].liquidations[j].type_travel);
        console.log(dataEdit[0].liquidations[j].type_travel)
        this.myControl2.controls['fecha'].setValue(dataEdit[0].liquidations[j].date);
        this.myControl2.controls['myControl_coin_id'].setValue(dataEdit[0].liquidations[j].coin_id);
        this.myControl2.controls['myControl_coin_id'].setValue(dataEdit[0].liquidations[j].coin_id);

      }
    });

  }

  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("/dashboard/liquidations") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
    //this.producEdit = [];
  }

  onAuto() { }
  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.value;
  }
  public changeSelect(id: number, property: string, event: any, value) {
    this.editField = value;
  }
  removeGasto(id_list: any, id_registro: any) {
    /*if (id_registro !== 0) {
      let modulo = "deleteOp";
      const dialogRef = this.dialog.open(LiquidationsDeleteComponent, {
        width: "450px",
        data: [id_registro, modulo, 1]
      });
      dialogRef.afterClosed().subscribe(result => {

        const r = result;
         if (r) {
          this.treeFormGroup.controls["myControl_gasto"].setValue('');
          this.treeFormGroup.controls["myControl_gasto_id"].setValue('');
          this.treeFormGroup.controls["myControl_tipo"].setValue('');
          this.treeFormGroup.controls["myControl_porcentaje"].setValue('');
          this.treeFormGroup.controls["myControl_cantidad"].setValue('');
          this.treeFormGroup.controls["myControl_moneda"].setValue('');
          this.personList.splice(id_list, 1);
          this.nameButtonAceptar = 'Agregar';
        }

      });

    } else {
      this.treeFormGroup.controls["myControl_gasto"].setValue('');
      this.treeFormGroup.controls["myControl_gasto_id"].setValue('');
      this.treeFormGroup.controls["myControl_tipo"].setValue('');
      this.treeFormGroup.controls["myControl_porcentaje"].setValue('');
      this.treeFormGroup.controls["myControl_cantidad"].setValue('');
      this.treeFormGroup.controls["myControl_moneda"].setValue('');
      this.personList.splice(id_list, 1);
      this.nameButtonAceptar = 'Agregar';
    }*/

    this.treeFormGroup.controls["myControl_gasto"].setValue('');
    this.treeFormGroup.controls["myControl_gasto_id"].setValue('');
    this.treeFormGroup.controls["myControl_tipo"].setValue('');
    this.treeFormGroup.controls["myControl_porcentaje"].setValue(0);
    this.treeFormGroup.controls["myControl_cantidad"].setValue(0);
    this.treeFormGroup.controls["myControl_moneda"].setValue('');
    this.personList.splice(id_list, 1);
    this.nameButtonAceptar = 'Agregar';
  }
  remove(id_list: any, id_registro: any, cantidad: any) {
    /*if (id_registro !== 0) {
      let modulo = "deleteOp";
      const dialogRef = this.dialog.open(LiquidationsDeleteComponent, {
        width: "450px",
        data: [id_registro, modulo, 1]
      });
      dialogRef.afterClosed().subscribe(result => {

        const r = result;
         if (r) {
          this.fourFormGroup.controls['myControl_coinRecibe'].setValue('');
          this.fourFormGroup.controls['myControl_coinRecibe_id'].setValue('');
          this.fourFormGroup.controls['myControl_monto'].setValue('');
          this.personListMontos.splice(id_list, 1);
          this.nameButtonAceptar2 = 'Agregar';
        }

      });

    } else {
      this.fourFormGroup.controls['myControl_coinRecibe'].setValue('');
      this.fourFormGroup.controls['myControl_coinRecibe_id'].setValue('');
      this.fourFormGroup.controls['myControl_monto'].setValue('');
      this.personListMontos.splice(id_list, 1);
      this.nameButtonAceptar2 = 'Agregar';
    }*/
    this.fourFormGroup.controls['myControl_coinRecibe'].setValue('');
    this.fourFormGroup.controls['myControl_coinRecibe_id'].setValue('');
    this.fourFormGroup.controls['myControl_monto'].setValue('');
    this.personListMontos.splice(id_list, 1);
    this.nameButtonAceptar2 = 'Agregar';
  }
  //ADD PARA MONTO EN EFECTIVO
  add2() {
    if (!this.fourFormGroup.valid) {
      return;
    } else {
      if (this.nameButtonAceptar2 === 'Agregar') {
        this.handleSubmit2(this.fourFormGroup, null);

      } else {
        this.handleSubmit2(this.fourFormGroup, this.idToUpdate2);
        //this.personList.splice(this.idToUpdate2, 1);

      }
    }
  }
  handleSubmit2(form: FormGroup, idv?: number) {
    let encuentra = 0;
    let encuentra2 = 0;
    let miid;
    let montoVan = (form.value.myControl_monto === NaN || form.value.myControl_monto === ' ' || form.value.myControl_monto === '' || form.value.myControl_monto === null) ? 0 : form.value.myControl_monto;


    if (idv == null) {
      miid = 0;
      for (let listMonto of this.personListMontos) {

        if (listMonto.id_coin === form.value.myControl_coinRecibe_id) {
          listMonto.monto = parseFloat(listMonto.monto) + parseFloat(montoVan),

            encuentra = 1;
        }
      }
      if (encuentra == 0) {
        this.personListMontos.push({
          id_coin: form.value.myControl_coinRecibe_id,
          name: form.value.myControl_coinRecibe,
          monto: parseFloat(montoVan),

        });
      }
    } else {

      miid = this.personListMontos[idv].id_coin;
      for (let listMonto of this.personListMontos) {
        if (listMonto.id_coin === miid) {
          listMonto.id_coin = miid,
            listMonto.monto = parseFloat(listMonto.monto) + parseFloat(montoVan),

            encuentra2 = 1;
        }
      }
      if (encuentra2 == 0) {
        this.personListMontos.push({
          id_coin: miid,
          name: form.value.myControl_coinRecibe,
          monto: parseFloat(montoVan),

        });
      }
    }
    this.clearInput2();
  }
  //ADD PARA GASTOS
  add() {
    if (!this.treeFormGroup.valid) {
      return;
    } else {
      if (this.nameButtonAceptar === 'Agregar') {
        this.handleSubmit(this.treeFormGroup, null);

      } else {
        this.handleSubmit(this.treeFormGroup, this.idToUpdate);
        //this.personList.splice(this.idToUpdate, 1);

      }
    }
  }
  handleSubmit(form: FormGroup, idv?: number) {
    let encuentra = 0;
    let encuentra2 = 0;
    let miid;


    if (idv == null) {
      miid = 0;
      for (let list of this.personList) {

        if (list.id_gasto === form.value.myControl_gasto_id) {

          encuentra = 1;
        }
      }
      if (encuentra == 0) {
        this.personList.push({
          id_gasto: form.value.myControl_gasto_id,
          name: form.value.myControl_gasto,
          percent: parseFloat((form.value.myControl_porcentaje) ? form.value.myControl_porcentaje : 0),
          quantity: parseFloat((form.value.myControl_cantidad) ? form.value.myControl_cantidad : 0),
          type: form.value.myControl_tipo,
          coin: form.value.myControl_moneda,
        });
      }
    } else {

      miid = this.personList[idv].id_gasto;
      for (let list of this.personList) {
        if (list.id_gasto === miid) {

          encuentra2 = 1;
        }
      }
      if (encuentra2 == 0) {
        this.personList.push({
          id_gasto: miid,
          name: form.value.myControl_gasto,
          percent: parseFloat((form.value.myControl_porcentaje) ? form.value.myControl_porcentaje : 0),
          quantity: parseFloat((form.value.myControl_cantidad) ? form.value.myControl_cantidad : 0),
          type: form.value.myControl_tipo,
          coin: form.value.myControl_moneda,
        });
      }
    }
    this.clearInput();
  }
  edittri(id: any) {
    this.fourFormGroup.controls['myControl_coinRecibe'].setValue(this.personListMontos[id]["name"]);
    this.fourFormGroup.controls['myControl_coinRecibe_id'].setValue(this.personListMontos[id]["id_coin"]);
    this.fourFormGroup.controls['myControl_monto'].setValue(this.personListMontos[id]["monto"]);

    this.nameButtonAceptar2 = 'Editar';
    this.idToUpdate2 = id;
  }

  public clearInput() {
    /*this.myControl2.reset();*/
    this.treeFormGroup.controls['myControl_gasto'].setValue('');
    this.treeFormGroup.controls['myControl_gasto_id'].setValue('');



  }
  public clearInput2() {
    /*this.myControl2.reset();*/
    this.fourFormGroup.controls['myControl_coinRecibe'].setValue('');
    this.fourFormGroup.controls['myControl_coinRecibe_id'].setValue('');
    this.fourFormGroup.controls['myControl_monto'].setValue('');
    this.nameButtonAceptar2 = 'Aceptar';
    this.idToUpdate2 = null;


  }
  public clearInputLiquidacion() {
    this.myControl2.controls['myControl_ofi_ini'].setValue('');
    this.myControl2.controls['myControl_ofi_ini_id'].setValue('');
    this.myControl2.controls['myControl_ofi_fin'].setValue('');
    this.myControl2.controls['myControl_ofi_fin_id'].setValue('');
    this.myControl2.controls['precio'].setValue('');
    this.myControl2.controls['cantidad'].setValue('');
    this.myControl2.controls['myControl_coin'].setValue('');
    this.myControl2.controls['myControl_coin_id'].setValue('');
    this.myControl2.controls['tipo'].setValue('');
    this.myControl2.controls['fecha'].setValue('');


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
  goBack(stepper: MatStepper) {
    stepper.previous();
  }
  ///////BUSCADORES INDIVIDUALES
  /*BUSCAR VEHICULO*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn6(cliente: Vehiculo): string {
    return cliente && cliente.name ? cliente.name : '';
  }

  onSelectionChanged6(event: MatAutocompleteSelectedEvent) {
    this.idsubservicio6 = 0;
    let namesub6: string;
    const viene6 = event.option.value;
    this.idsubservicio6 = viene6.id ? viene6.id : 0;
    namesub6 = viene6.name ? viene6.name : '';
    this.firstFormGroup.controls['vehiculo'].setValue(namesub6);
    this.firstFormGroup.controls['vehiculo_id'].setValue(this.idsubservicio6);

    this.goNext(this.stepper)

  }

  private _filter6(name: string): Vehiculo[] {
    const filterValue6 = name.toLowerCase();
    return this.options6.filter(option => option.name.toLowerCase().indexOf(filterValue6) === 0);
  }
  /*BUSCAR monto en efectivo*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn9(moneda: Moneda): string {
    return moneda && moneda.name ? moneda.name : '';
  }

  onSelectionChanged9(event: MatAutocompleteSelectedEvent) {
    this.idsubmonto9 = 0;
    let namesub9: string;

    const viene9 = event.option.value;
    this.idsubmonto9 = viene9.id ? viene9.id : 0;
    namesub9 = viene9.name ? viene9.name : '';
    this.fourFormGroup.controls['myControl_coinRecibe'].setValue(namesub9);
    this.fourFormGroup.controls['myControl_coinRecibe_id'].setValue(this.idsubmonto9);

  }

  private _filter9(name: string): Moneda[] {
    const filterValue9 = name.toLowerCase();
    return this.options9.filter(option => option.name.toLowerCase().indexOf(filterValue9) === 0);
  }
  /*BUSCAR GASTOS, DEDUCCIONES, RETENCIONES*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn8(servicio: Oficina): string {
    return servicio && servicio.name ? servicio.name : '';
  }

  onSelectionChanged8(event: MatAutocompleteSelectedEvent) {
    this.idsubgastos8 = 0;
    let namesub8: string;
    let porcentaje: number
    let cantidad: number
    let tipo: string
    let moneda: string
    const viene8 = event.option.value;
    this.idsubgastos8 = viene8.id ? viene8.id : 0;
    namesub8 = viene8.name ? viene8.name : '';
    porcentaje = viene8.percent ? viene8.percent : '';
    cantidad = viene8.quantity ? viene8.quantity : '';
    tipo = viene8.type ? viene8.type : '';
    moneda = viene8.coin ? viene8.coin : '';

    this.treeFormGroup.controls['myControl_gasto'].setValue(namesub8);
    this.treeFormGroup.controls['myControl_gasto_id'].setValue(this.idsubgastos8);
    this.treeFormGroup.controls['myControl_porcentaje'].setValue(porcentaje);
    this.treeFormGroup.controls['myControl_cantidad'].setValue(cantidad);
    this.treeFormGroup.controls['myControl_tipo'].setValue(tipo);
    this.treeFormGroup.controls['myControl_moneda'].setValue(moneda);

  }

  private _filter8(name: string): Gastos[] {
    const filterValue8 = name.toLowerCase();
    return this.options8.filter(option => option.name.toLowerCase().indexOf(filterValue8) === 0);
  }
  /*BUSCAR moneda*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn7(moneda: Moneda): string {
    return moneda && moneda.name ? moneda.name : '';
  }

  onSelectionChanged7(event: MatAutocompleteSelectedEvent) {
    this.idsubmoneda7 = 0;
    let namesub7: string;

    const viene7 = event.option.value;
    this.idsubmoneda7 = viene7.id ? viene7.id : 0;
    namesub7 = viene7.name ? viene7.name : '';
    this.myControl2.controls['myControl_coin'].setValue(namesub7);
    this.myControl2.controls['myControl_coin_id'].setValue(this.idsubmoneda7);

  }

  private _filter7(name: string): Moneda[] {
    const filterValue7 = name.toLowerCase();
    return this.options7.filter(option => option.name.toLowerCase().indexOf(filterValue7) === 0);
  }
  /*BUSCAR OFICINA INICIO*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn4(servicio: Oficina): string {
    return servicio && servicio.name ? servicio.name : '';
  }

  onSelectionChanged4(event: MatAutocompleteSelectedEvent) {
    this.idsubservicio4 = 0;
    let namesub4: string;

    const viene4 = event.option.value;
    this.idsubservicio4 = viene4.id ? viene4.id : 0;
    namesub4 = viene4.name ? viene4.name : '';
    this.myControl2.controls['myControl_ofi_ini'].setValue(namesub4);
    this.myControl2.controls['myControl_ofi_ini_id'].setValue(this.idsubservicio4);

  }

  private _filter4(name: string): Oficina[] {
    const filterValue4 = name.toLowerCase();
    return this.options4.filter(option => option.name.toLowerCase().indexOf(filterValue4) === 0);
  }
  /*BUSCAR oficina llegada*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn5(color: Oficina): string {
    return color && color.name ? color.name : '';
  }

  onSelectionChanged5(event: MatAutocompleteSelectedEvent) {
    this.idsubservicio5 = 0;
    let namesub5: string;

    const viene5 = event.option.value;
    this.idsubservicio5 = viene5.id ? viene5.id : 0;
    namesub5 = viene5.name ? viene5.name : '';
    this.myControl2.controls['myControl_ofi_fin'].setValue(namesub5);
    this.myControl2.controls['myControl_ofi_fin_id'].setValue(this.idsubservicio5);

  }

  private _filter5(name: string): Oficina[] {
    const filterValue5 = name.toLowerCase();
    return this.options5.filter(option => option.name.toLowerCase().indexOf(filterValue5) === 0);
  }

  //////////////////////////////////////////TABLA Y SELECTOR DE VEHICULOS/////////////////////////////////
  public selectUsers(event: any, options6: any) {
    this.idsubservicio6 = 0;
    this.idsubservicio6 = options6.id ? options6.id : 0;

    this.firstFormGroup.controls['vehiculo'].setValue(options6.name);
    this.firstFormGroup.controls['vehiculo_id'].setValue(this.idsubservicio6);


    this.goNext(this.stepper)
  }
  /////////////FECHA  
  SendDataonChange(event: any) {
    console.log(event.target.value);
  }
}

