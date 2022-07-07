import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { SalidasServices } from '../../salidas/salidas-services/salidas-services'
import { environment } from '../../../../environments/environment';
import { DateRangeComponent } from '../date-range/date-range.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ProcessedCancelComponent } from '../dialog/processed-cancel/processed-cancel.component'
declare var $: any;
const pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;

@Component({
  selector: 'app-processed-table',
  templateUrl: './processed-table.component.html',
  styleUrls: ['./processed-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProcessedTableComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  @ViewChild(DateRangeComponent) dateRange: DateRangeComponent;

  displayedColumns: string[] = ['Item', 'ID', 'Cliente - Sucursal', 'Peso de entrada', 'Peso de salida', 'Fecha Procesada', 'Fecha Anulada', 'Status', 'Usuario', 'Acciones'];
  dataSource;
  campaignOne: FormGroup;

  public titleModal: string;
  public element = [];
  public data;
  public dataOut;
  expandedElement;
  public api: string;
  fechas: any;
  public contInit: number = 0;
  public fechaInicio = "";
  public fechaFin = "";
  public total_weight_in = 0;
  public total_weight_out = 0;
  public fechaExcelInicio = "";
  public fechaExcelFin = "";
  public fechaViene
  eventoStart
  keysStart
  eventoEnd
  keysEnd
  ngAfterViewInit() {
  }
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public toasTer: ToastrService,
    public salidasServices: SalidasServices,
    private route: ActivatedRoute,

  ) {
    //this.api = environment.apiInventory;
    // this.titleModal = "Crear Salida";
    this.api = environment.apiJakiro2;

  }

  ngOnInit() {
    this.fechaInicio = "";
    this.fechaFin = "";
    this.total_weight_in = 0;
    this.total_weight_out = 0;

    const sb = this.route.params.subscribe(
      (params: Params) => {
        this.fechaViene = params.id;
        return this.fechaViene
      }
    );
    this.campaignOne = new FormGroup({
      start2: new FormControl(),
      end2: new FormControl()
    });
    if (this.fechaViene) {
      let vFecha = this.fechaViene.split("_")
      let inif = vFecha[0].split("-")
      let finf = vFecha[1].split("-");
      this.fechaInicio = inif[2] + "-" + inif[1] + "-" + inif[0];
      this.fechaFin = finf[2] + "-" + finf[1] + "-" + finf[0];
      this.fechaExcelInicio = inif[0] + "-" + inif[1] + "-" + inif[2];
      this.fechaExcelFin = finf[0] + "-" + finf[1] + "-" + finf[2];
    }

    // console.log(this.fechaInicio)
    //console.log(this.fechaFin)

    this.loadAll(this.fechaInicio, this.fechaFin)
  }
  public loadAll(fInicio?, fFin?) {

    console.log(fInicio + "_" + fFin)
    this.total_weight_in = 0;
    this.total_weight_out = 0;
    this.salidasServices.getOperaciones(fInicio, fFin).subscribe((value) => {
      this.data = [];
      this.dataOut = [];

      this.element = [];
      console.log(value["data"])
      if (value["data"]) {
        this.element = [];
        Object.keys(value["data"]).forEach(e => {
          const datos = {
            Item: "",
            "id": value["data"][e].id,
            "client_name": value["data"][e].client_name,
            "client_id": value["data"][e].client_id,
            "branch_name": value["data"][e].branch_name,
            "branch_id": value["data"][e].branch_id,
            "observation": value["data"][e].observation,
            "processed_time": value["data"][e].processed_time,
            "user": value["data"][e].user,
            "user_env": value["data"][e].user_env,

            "weight_in": value["data"][e].weight_in,
            "weight_out": value["data"][e].weight_out,
            "status": value["data"][e].status,
            "canceled_time": value["data"][e].canceled_time,
            "cancel_reason": value["data"][e].cancel_reason,
            "inputs": [],
            "outputs": []
          };
          this.element.push(datos);
          Object.keys(value["data"][e].inputs).forEach(i => {
            this.data =
            {
              id: value["data"][e].inputs[i].id,
              weight: value["data"][e].inputs[i].weight,
              quantity: value["data"][e].inputs[i].quantity,
              service_id: value["data"][e].inputs[i].service_id,
              service_name: value["data"][e].inputs[i].service_name,
              color_id: value["data"][e].inputs[i].color_id,
              color_name: value["data"][e].inputs[i].color_name,
              subservices_tag: value["data"][e].inputs[i].subservices_tag,
              operation_type: value["data"][e].inputs[i].operation_type,
              created_at: value["data"][e].inputs[i].date_time,
            };
            this.element[e].inputs.push(this.data);
          });
          Object.keys(value["data"][e].outputs).forEach(i => {
            this.dataOut =
            {
              id: value["data"][e].outputs[i].id,
              weight: value["data"][e].outputs[i].weight,
              quantity: value["data"][e].outputs[i].quantity,
              service_id: value["data"][e].outputs[i].service_id,
              service_name: value["data"][e].outputs[i].service_name,
              color_id: value["data"][e].outputs[i].color_id,
              color_name: value["data"][e].outputs[i].color_name,
              subservices_tag: value["data"][e].outputs[i].subservices_tag,
              operation_type: value["data"][e].outputs[i].operation_type,
              created_at: value["data"][e].outputs[i].date_time,
            };
            this.element[e].outputs.push(this.dataOut);
          });
        });
        Object.keys(this.element).forEach((i, index) => {
          this.total_weight_in = this.total_weight_in + parseFloat(this.element[i].weight_in);
          this.total_weight_out = this.total_weight_out + parseFloat(this.element[i].weight_out);

        });
        Object.keys(this.element).forEach((i, index) => {
          this.element[i].Item = index + 1;

        });


        this.dataSource = new MatTableDataSource(this.element);
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
      } else {
        this.toasTer.error(value["message"]);
        this.data = [];
        this.dataOut = [];
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
  }

  public closeModals(value) {
    this.reloadComponent();
    this.basicModal.hide();
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf("/dashboard/Procesadas") > -1 ? "/" : "/";
    this.router
      .navigateByUrl(refreshUrl)
      .then(() => this.router.navigateByUrl(currentUrl));
    //this.producEdit = [];
  }
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    Object.keys(this.dataSource.filteredData).forEach((i, index) => {
      this.dataSource.filteredData[i].Item = index + 1;
    });
  }
  print(id) {
    window.open(this.api + 'reports/print/' + id);
  }

  cancel(id) {
    let modulo = "deleteOp";
    this.dialog.open(ProcessedCancelComponent, {
      width: "450px",
      data: [id, modulo, 0]
    });

  }
  //*  FUNCION PARA EL FILTRADO DESDE EL SELECTOR DE FECHAS

  /*public DateFilter(event) {
      this.contInit = 0;
     this.fechas = event;
     const fechaInicio = this.convertFormat(this.fechas.fromDate);
     const fechaFinal = this.convertFormat(this.fechas.toDate);
     this.fechaExcelInicio = this.convertFormatYear(this.fechas.fromDate);
     this.fechaExcelFin = this.convertFormatYear(this.fechas.toDate);
  
     console.log(fechaInicio + "_" + fechaFinal)
     this.loadAll(fechaInicio, fechaFinal);
   }*/
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
      fechaSearch = fechaSearch + '-' + 0 + (mes + 1) + '-' + anno;
    } else {
      fechaSearch = fechaSearch + '-' + (mes + 1) + '-' + anno;
    }



    return fechaSearch;
  }
  convertFormatYear(range) {
    var fecha = new Date(range)
    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var anno = fecha.getFullYear();

    var fechaSearch;

    if ((mes + 1) < 10) {
      fechaSearch = anno + '-' + 0 + (mes + 1);
    } else {
      fechaSearch = anno + '-' + (mes + 1);
    }


    if (dia < 10) {
      fechaSearch = fechaSearch + '-' + 0 + (dia);
    } else {
      fechaSearch = fechaSearch + '-' + (dia);
    }





    return fechaSearch;

  }
  //*  FUNCION PARA EL FILTRADO DESDE EL SELECTOR DE FECHAS

  public exportTo() {
    //qajakiro2.zippyttech.com/api/reports/export/2022-02-01_2022-02-15?status=procesada
    console.log(this.fechaExcelInicio + "_" + this.fechaExcelFin)
    window.open(this.api + 'reports/export/' + this.fechaExcelInicio + "_" + this.fechaExcelFin + '?status=procesada');


  }

  Refresh2() {

    this.router.navigate(['dashboard/report-form/report-form'])

  }
  toModel(date: Date): string | null {
    return date != null ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : null;
  }
  public DateFilter() {

    let fechaBasica = new Date()


    let fechaInicio = (this.eventoStart) ? this.eventoStart : ""
    let fechaFin = (this.eventoEnd) ? this.eventoEnd : ""

    if (fechaInicio !== "" && fechaFin !== "") {
      fechaInicio = this.toModel(this.eventoStart)
      fechaFin = this.toModel(this.eventoEnd)

    }
    if (fechaInicio !== "" && fechaFin === "") {
      fechaInicio = this.toModel(this.eventoStart)
      fechaFin = this.toModel(this.eventoStart)

    }
    if (fechaInicio === "" && fechaFin !== "") {
      fechaInicio = this.toModel(this.eventoEnd)
      fechaFin = this.toModel(this.eventoEnd)

    }
    if (fechaInicio === "" && fechaFin === "") {
      fechaInicio = this.toModel(fechaBasica)
      fechaFin = this.toModel(fechaBasica)
      /*
      const today2 = new Date();
      const day = today2.getDay();
  
      const month2 = today2.getMonth();
      const year2 = today2.getFullYear();*/
    }


    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    let inif = fechaInicio.split("-")
    let finf = fechaFin.split("-");
    this.fechaExcelInicio = inif[0] + "-" + inif[1] + "-" + inif[2];
    this.fechaExcelFin = finf[0] + "-" + finf[1] + "-" + finf[2];


    console.log(this.fechaInicio + "_" + this.fechaFin)
    this.loadAll(this.fechaInicio, this.fechaFin);
  }
  filterByDateStart(event: MatDatepickerInputEvent<Date>, key) {
    console.log("startChange", event.value, key)
    this.eventoStart = event.value
    this.keysStart = key
  }
  filterByDateEnd(event: MatDatepickerInputEvent<Date>, key) {
    console.log("endChange", event.value, key)
    this.eventoEnd = event.value
    this.keysEnd = key
  }
} 