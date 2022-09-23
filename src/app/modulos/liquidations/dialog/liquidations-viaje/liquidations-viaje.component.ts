
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { GastosvariosServices } from "../../../gastosvarios/gastosvarios-services/gastosvarios-services";
import { userMsg } from "../../../../utils/const/message";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiquidationsServices } from './../../liquidations-services/liquidations-services'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
  MinLengthValidator
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface Gastos {
  id: number;
  name: string;
}

@Component({
  selector: 'app-liquidations-viaje',
  templateUrl: './liquidations-viaje.component.html',
  styleUrls: ['./liquidations-viaje.component.scss']
})
export class LiquidationsViajeComponent implements OnInit {
  public id: any;
  treeFormGroup: FormGroup;

  public nameButtonAceptar: string = 'Agregar';
  public idToUpdate: number;

  //buscar gastos
  public filteredOptions8: Observable<Gastos[]>;
  public options8: Array<any> = [];
  public idsubgastos8 = 0;
  public personList: Array<any> = [
    {
      id_gasto: 0,
      name: '',
      quantity: '',
      coin: ''

    }
  ];
  public submitted = false;
  public loading: boolean = false;
  public editSubmit: boolean = false;
  public closeStatus: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<LiquidationsViajeComponent>,
    public router: Router,
    public gastosvariosServices: GastosvariosServices,
    public toasTer: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
    private formBuilder: FormBuilder,
    private liquidationsServices: LiquidationsServices

  ) {
    this.id = this.data;


  }
  ngOnInit() {
    this.personList = [];
    this.treeFormGroup = this.formBuilder.group({


      myControl_gasto: [''],
      myControl_gasto_id: [''],
      myControl_moneda: [''],
      observacion: [""]

    });
    /*BUSCAR gastos*/
    this.gastosvariosServices.getList().pipe()
      .subscribe((value) => {
        Object.keys(value["data"]).forEach(i => {
          this.options8.push(
            {
              "id": value["data"][i].id,
              "name": value["data"][i].description,
              "coin": value["data"][i].coin_id,

            }

          );

        });
      });
    this.filteredOptions8 = this.treeFormGroup.controls['myControl_gasto'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter8(name) : this.options8.slice())
    );
  }

  get t() {
    return this.treeFormGroup.controls;
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
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
          coin: form.value.myControl_moneda,
        });
      }
    }
    this.clearInput();
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
    this.treeFormGroup.controls["myControl_moneda"].setValue('');
    this.personList.splice(id_list, 1);
    this.nameButtonAceptar = 'Agregar';
  }

  public clearInput() {
    /*this.myControl2.reset();*/
    this.treeFormGroup.controls['myControl_gasto'].setValue('');
    this.treeFormGroup.controls['myControl_gasto_id'].setValue('');



  }
  /*BUSCAR GASTOS, DEDUCCIONES, RETENCIONES*///////////////////////////////////////////////////////////////////////////////////////////////

  displayFn8(servicio: Gastos): string {
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
    moneda = viene8.coin ? viene8.coin : '';

    this.treeFormGroup.controls['myControl_gasto'].setValue(namesub8);
    this.treeFormGroup.controls['myControl_gasto_id'].setValue(this.idsubgastos8);
    this.treeFormGroup.controls['myControl_moneda'].setValue(moneda);

  }

  private _filter8(name: string): Gastos[] {
    const filterValue8 = name.toLowerCase();
    return this.options8.filter(option => option.name.toLowerCase().indexOf(filterValue8) === 0);
  }
  onSubmit() {


    this.loading = true;
    let listEnpti = [];
    let list = [];
    Object.keys(this.personList).forEach(e => {
      list.push(
        this.personList[e]["id_gasto"],
      );
    });
    listEnpti = list.filter(function (n) {
      let value1 = n.id_gasto;
      return value1 === "";
    });
    if (listEnpti.length > 0) {
      this.loading = false;
      this.toasTer.error('No puede guardar campo vacios');
    } else {
      if (this.personList.length === 0) {
        this.loading = false;
        this.toasTer.error('Debe agregar al menos 1 operación');
      } else {
        let bodyData = Object.assign({
          "observation": this.treeFormGroup.controls['observacion'].value,
          "gastos": list,
        });
        console.warn(bodyData);
        this.liquidationsServices.updateTravels(this.id, bodyData).subscribe(
          response => {
            this.toasTer.success("Gastos de viaje agregados");
            this.reloadComponent();
          },
          error => {
            this.toasTer.error("Error");
          });
      }
    }
  }
}
