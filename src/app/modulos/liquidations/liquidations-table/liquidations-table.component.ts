
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from "@angular/router";

import { LiquidationsServices } from '../liquidations-services/liquidations-services'
import { LiquidationsFormComponent } from '../liquidations-form/liquidations-form.component'
import { LiquidationsViajeComponent } from '../dialog/liquidations-viaje/liquidations-viaje.component'
import { LiquidationsDeleteComponent } from '../dialog/liquidations-delete/liquidations-delete.component'

import { LocalService } from '../../../http/httpServices/local-service.service';
import { environment } from '../../../../environments/environment';
import { CoinsServices } from './../../coins/coins-services/coins-services'
import { LiquidationsGastosComponent } from './../dialog/liquidations-gastos/liquidations-gastos.component'
declare var $: any;

@Component({
  selector: 'app-liquidations-table',
  templateUrl: './liquidations-table.component.html',
  styleUrls: ['./liquidations-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LiquidationsTableComponent implements OnInit {

  @ViewChild(LiquidationsFormComponent) form: LiquidationsFormComponent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  displayedColumns: string[] = ['Item', 'Número de Control', 'Fecha Inicio', 'Fecha Fin', 'Total', 'Estatus', 'Acciones'];
  dataSource;
  public titleModal: string;
  public element = [];
  data: any = [];
  dataGastos: any = [];

  expandedElement;

  fechas: any;
  public contInit: number = 0;
  public fechaInicio = "";
  public fechaFin = "";

  public total_weight_in = 0;
  public total_weight_out = 0;
  public role;
  public api: string;
  public totalViajesLiquidacion = 0
  public apiURL = environment.apiUrl
  ngAfterViewInit() {
  }
  constructor(
    public localService: LocalService,
    public dialog: MatDialog,
    public router: Router,
    public toasTer: ToastrService,
    private liquidationsServices: LiquidationsServices,

  ) {
    this.titleModal = "Crear Liquidación";
    this.role = this.checkRole();

  }

  ngOnInit() {
    this.fechaInicio = "";
    this.fechaFin = "";

    this.total_weight_in = 0;

    //this.loadAll(this.fechaInicio, this.fechaFin)
    //this.loadMontoTotalLiquidaciones(this.fechaInicio, this.fechaFin)
  }
  public loadMontoTotalLiquidaciones(fInicio?, fFin?) {
    //////////total de liquidacion
    this.totalViajesLiquidacion = 0
    this.liquidationsServices.getListTravels(fInicio, fFin).subscribe((value) => {
      console.log(value["data"])

      Object.keys(value["data"]).forEach(e => {
        if (value["data"][e].status == 'Finalizado') {
          console.log(value["data"][e])

          //this.totalViajes = this.totalViajes + 1
          this.totalViajesLiquidacion = this.totalViajesLiquidacion + value["data"][e].total

        }
        if (value["data"][e].status == 'En Viaje') {

          //this.totalViajesEnCurso = this.totalViajesEnCurso + 1

        }
      })

    })
  }
  public loadAll(fInicio?, fFin?) {
    this.total_weight_in = 0;
    this.liquidationsServices.getListTravels(fInicio, fFin).subscribe((value) => {
      this.data = [];
      this.dataGastos = [];

      this.element = [];
      console.log(value)
      if (value["data"]) {
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
          const datos = {
            Item: "",
            "id": value["data"][e].id,
            "vehicle": value["data"][e].vehicle.num_control,
            "vehicle_id": value["data"][e].vehicle_id,

            "date_start": value["data"][e].date_start,
            "date_end": value["data"][e].date_end,
            "total": value["data"][e].total,
            "status": value["data"][e].status,
            "observation": value["data"][e].observation,
            "liquidations": [],
            "gastos": []
          };
          this.element.push(datos);
          Object.keys(value["data"][e].liquidations).forEach(i => {
            this.data =
            {
              id: value["data"][e].liquidations[i].id,
              date: value["data"][e].liquidations[i].date,
              precio_pasaje: value["data"][e].liquidations[i].precio_pasaje,
              pasajeros: value["data"][e].liquidations[i].pasajeros,
              name_office_origin: value["data"][e].liquidations[i].name_office_origin,
              name_office_destiny: value["data"][e].liquidations[i].name_office_destiny,
              type_travel: value["data"][e].liquidations[i].type_travel,
              coin_id: value["data"][e].liquidations[i].coin_id,

              total: value["data"][e].liquidations[i].total,


            };
            this.element[e].liquidations.push(this.data);
          });
          Object.keys(value["data"][e].gastos).forEach(i => {
            this.dataGastos = value["data"][e].gastos[i]

            this.element[e].gastos.push(this.dataGastos);
          });
        });

        Object.keys(this.element).forEach((i, index) => {
          this.element[i].Item = index + 1;
          this.total_weight_in = this.total_weight_in + parseFloat(this.element[i].weight_in);

        });
        console.warn(this.element)
        this.dataSource = new MatTableDataSource(this.element);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      } else {
        this.toasTer.error(value["message"]);
        this.data = [];
        this.element = [];
        this.dataSource = new MatTableDataSource(this.element);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      }
    });

  }
  Refresh() {

    this.fechaInicio = "";
    this.fechaFin = "";
    this.loadAll(this.fechaInicio, this.fechaFin);
    this.loadMontoTotalLiquidaciones(this.fechaInicio, this.fechaFin);
  }
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    Object.keys(this.dataSource.filteredData).forEach((i, index) => {
      this.dataSource.filteredData[i].Item = index + 1;
    });
  }
  reset() {
    /* this.form.myControl2.reset();*/
    this.form.nameButtonAceptar = 'Agregar';
    this.form.nameButtonAceptar2 = 'Agregar';

    this.form.firstFormGroup.controls['vehiculo'].setValue('');
    this.form.firstFormGroup.controls['vehiculo_id'].setValue('');


    this.form.myControl2.controls['myControl_ofi_ini'].setValue('');
    this.form.myControl2.controls['myControl_ofi_ini_id'].setValue('');
    this.form.myControl2.controls['myControl_ofi_fin'].setValue('');
    this.form.myControl2.controls['myControl_ofi_fin_id'].setValue('');
    this.form.myControl2.controls['precio'].setValue('');
    this.form.myControl2.controls['cantidad'].setValue('');
    this.form.myControl2.controls['myControl_coin'].setValue('');
    this.form.myControl2.controls['myControl_coin_id'].setValue('');
    this.form.myControl2.controls['fecha'].setValue('');
    this.form.myControl2.controls['tipo'].setValue('');

    this.form.treeFormGroup.controls["myControl_gasto"].setValue('');
    this.form.treeFormGroup.controls["myControl_gasto_id"].setValue('');
    this.form.treeFormGroup.controls["myControl_porcentaje"].setValue(0);
    this.form.treeFormGroup.controls["myControl_cantidad"].setValue(0);
    this.form.treeFormGroup.controls["myControl_tipo"].setValue('');
    this.form.treeFormGroup.controls["myControl_moneda"].setValue('');

    this.form.fourFormGroup.controls["myControl_coinRecibe"].setValue('');
    this.form.fourFormGroup.controls["myControl_coinRecibe_id"].setValue('');
    this.form.fourFormGroup.controls["myControl_monto"].setValue(0);


    this.form.putSubmit = false;
    this.titleModal = "Crear Liquidación";
    this.form.personList = [];
    this.form.personListMontos = [];

    this.form.stepper.selectedIndex = 0;
  }
  showModal() {
    $("#basicModal").show();
    this.reset();
  }
  public closeModals(value) {
    this.reloadComponent();
    this.basicModal.hide();

  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf('/dashboard/liquidations') > -1 ? '/' : '/';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }
  public openEdit(idLiquidacion, idViaje) {
    this.titleModal = "Modificar Liquidación";
    //console.log(idLiquidacion + " " + idViaje)
    this.form.addForm(idLiquidacion, idViaje);
  }
  public openGastosViaje(id) {
    let modulo = "delete";
    this.dialog.open(LiquidationsViajeComponent, {
      width: "650px",
      data: [id]
    });
  }
  eliminar(id) {
    let modulo = "delete";
    this.dialog.open(LiquidationsDeleteComponent, {
      width: "450px",
      data: [id, modulo, 0]
    });

  }
  eliminarOp(id) {
    let modulo = "deleteOp";
    this.dialog.open(LiquidationsDeleteComponent, {
      width: "450px",
      data: [id, modulo, 0]
    });

  }
  verGastos(id) {
    this.dialog.open(LiquidationsGastosComponent, {
      width: "600px",
      data: [id]
    });

  }
  //*  FUNCION PARA EL FILTRADO DESDE EL SELECTOR DE FECHAS

  public DateFilter(event) {
    //const info = JSON.parse(localStorage.getItem('info'));
    console.log(event)
    this.contInit = 0;
    this.fechas = event;
    const fechaInicio = this.convertFormat(this.fechas.fromDate);
    const fechaFinal = this.convertFormat(this.fechas.toDate);

    //this.doWhere = 'where=[ {"op":"eq","field":"hg.account","value":' + info.account +'}, {"op":"bt", "field":"hg.created_at", "value":["' + fechaInicio + ' 01:00:00","' + fechaFinal + ' 23:59:59"]}]'
    //this.doWhereReport = 'where=[ {"op":"eq","field":"hg.account","value":' + info.account +'}, {"op":"bt", "field":"hg.created_at", "value":["' + fechaInicio + ' 01:00:00","' + fechaFinal + ' 23:59:59"]}]'
    //this.loadDataTable('historialgenerates?' + this.doWhere);
    //this.paginator.pageIndex = 0;
    this.loadAll(fechaInicio, fechaFinal);
    this.loadMontoTotalLiquidaciones(fechaInicio, fechaFinal);
  }

  convertFormat(range) {
    var fecha = new Date(range)
    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var anno = fecha.getFullYear();

    var fechaSearch;
    if (dia < 10) {
      fechaSearch = 0 + (dia);
    } else {
      fechaSearch = (dia);
    }

    if ((mes + 1) < 10) {
      fechaSearch = anno + '-' + 0 + (mes + 1) + '-' + fechaSearch;
    } else {
      fechaSearch = anno + '-' + (mes + 1) + '-' + fechaSearch;
    }



    return fechaSearch;

  }

  //*  FUNCION PARA EL FILTRADO DESDE EL SELECTOR DE FECHAS
  checkRole() {

    let info = this.localService.getJsonValue('info');
    if (info.rol) {
      if (info.rol.toLowerCase() === 'admin') {
        return 1;
      }
      if (info.rol.toLowerCase() === 'operador') {
        return 2;
      }

    }

  }
  reporte(id) {
    /*this.liquidationsServices.getReporte(id).subscribe((value) => {
      console.log(value["data"])

    })*/

    let url = `${this.apiURL}/report/travels?travel_id=${id}`

    window.open(url);
  }
}