
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { EntradasServices } from '../../entradas/entradas-services/entradas-services'
import { LocalService } from '../../../http/httpServices/local-service.service';
import { environment } from '../../../../environments/environment';
const pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;

declare var $: any;

@Component({
  selector: 'app-report-entrada',
  templateUrl: './report-entrada.component.html',
  styleUrls: ['./report-entrada.component.scss'],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReportEntradaComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  displayedColumns: string[] = ['Item', 'ID', 'Cliente - Sucursal', 'Fecha - Hora', 'Peso de entrada', 'Usuario'];
  dataSource;
  public titleModal: string;
  public element = [];
  data: any = [];
  expandedElement;

  fechas: any;
  public contInit: number = 0;
  public fechaInicio = "";
  public fechaFin = "";

  public total_weight_in = 0;
  public total_weight_out = 0;
  public role;
  public api: string;
  fechaViene: string
  campaignOne: FormGroup;
  eventoStart
  keysStart
  eventoEnd
  keysEnd
  ngAfterViewInit() {
  }
  constructor(
    public localService: LocalService,
    private route: ActivatedRoute,

    public dialog: MatDialog,
    public router: Router,
    public toasTer: ToastrService,
    public entradasServices: EntradasServices,

  ) {
    //this.api = environment.apiInventory;
    this.titleModal = "Crear Entrada";
    this.role = this.checkRole();
    this.api = environment.apiJakiro2;

  }

  ngOnInit() {
    this.fechaInicio = "";
    this.fechaFin = "";

    this.total_weight_in = 0;
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
      this.fechaInicio = vFecha[0];
      this.fechaFin = vFecha[1];
    }
    console.log(this.fechaViene)

    this.loadAll(this.fechaInicio, this.fechaFin)
  }
  public loadAll(fInicio?, fFin?) {

    this.total_weight_in = 0;
    this.entradasServices.getList(fInicio, fFin).subscribe((value) => {
      this.data = [];
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
            "date_time": value["data"][e].date_time,
            "user": value["data"][e].user,
            "user_env": value["data"][e].user_env,

            "weight_in": value["data"][e].weight_in,

            "inputs": []
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
        });

        Object.keys(this.element).forEach((i, index) => {
          this.element[i].Item = index + 1;
          this.total_weight_in = this.total_weight_in + parseFloat(this.element[i].weight_in);

        });

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

    this.router.navigate(['dashboard/report-form/report-form'])

  }
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    Object.keys(this.dataSource.filteredData).forEach((i, index) => {
      this.dataSource.filteredData[i].Item = index + 1;
    });
  }

  showModal() {
    $("#basicModal").show();
  }
  public closeModals(value) {
    this.reloadComponent();
    this.basicModal.hide();

  }
  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf('/dashboard/Entradas') > -1 ? '/' : '/';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }



  //*  FUNCION PARA EL FILTRADO DESDE EL SELECTOR DE FECHAS
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


    console.log(this.fechaInicio + "_" + this.fechaFin)
    this.loadAll(this.fechaInicio, this.fechaFin);
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
      fechaSearch = fechaSearch + '-' + 0 + (mes + 1) + '-' + anno;
    } else {
      fechaSearch = fechaSearch + '-' + (mes + 1) + '-' + anno;
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
      if (info.rol.toLowerCase() === 'op_entradas') {
        return 3;
      }
    }

  }
  exportTo() {

    window.open(this.api + 'reports/inputs/exportinput/' + this.fechaInicio + "_" + this.fechaFin);

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
