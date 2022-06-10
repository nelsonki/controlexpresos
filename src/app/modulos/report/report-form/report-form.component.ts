
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
//import * as $ from "jquery";

import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../../environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LocalService } from '../../../http/httpServices/local-service.service';
import { HttpService } from '../../../http/httpServices/http.service';
import { userMsg } from "../../../utils/const/message";
import { SettingsServices } from '../../settings/settings-services/settings-services';
import { DateRangeComponent } from '../date-range/date-range.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
declare var $: any;
const pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit {
  @ViewChild(DateRangeComponent) dateRange: DateRangeComponent;

  form: FormGroup;
  campaignOne: FormGroup;

  public account;
  public userRole;
  public apiSettings;

  public operations;
  public idOperations;

  public selectedCo: any;

  inputObj: any;
  @Input() element: string;

  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  @Output() statusCloseModal = new EventEmitter();

  fechas: any;
  eventoStart
  keysStart
  eventoEnd
  keysEnd
  public contInit: number = 0;
  public fechaInicio = "";
  public fechaFin = "";
  public total_weight_in = 0;
  public total_weight_out = 0;
  public fechaExcelInicio = "";
  public fechaExcelFin = "";
  public api: string;

  constructor(public router: Router,
    public toasTer: ToastrService,
    public http: HttpService,
    private formBuilder: FormBuilder,
    public localService: LocalService,
    public cd: ChangeDetectorRef,
    public settingsServices: SettingsServices,
    public dialog: MatDialog,

  ) {
    this.api = environment.apiJakiro2;

  }

  ngOnInit(): void {
    const today2 = new Date();
    const day = today2.getDay();

    const month2 = today2.getMonth();
    const year2 = today2.getFullYear();

    this.campaignOne = new FormGroup({
      start2: new FormControl(),
      end2: new FormControl()
    });
    this.form = this.formBuilder.group({
      type: ['', Validators.required],

    });
    let info = this.localService.getJsonValue('info');
    this.apiSettings = environment.apiJakiro2;
    this.getDataSettings();
    this.userRole = info.rol;

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
  public compare(a, b, isAsc) {
    return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getDataSettings() {

    this.settingsServices.getList().subscribe((data: any) => {
      console.log(data['data'])
      this.operations = data['data'].total_operations;
      this.idOperations = data['data'].id;

      //this.form.controls['type'].setValue(data['data'].total_operations);
    });
  }




  submitUpdateProfile() {
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
    let tipoReporte = this.form.controls['type'].value

    switch (tipoReporte.toLowerCase()) {
      case "re":
        //https://qajakiro2.zippyttech.com/api/reports/inputs/exportinput/2022-05-20_2022-06-07

        // window.open(this.api + 'reports/inputs/exportinput/' + fechaInicio + "_" + fechaFin);
        this.router.navigate(['dashboard/report-form/report-form/report-entrada/' + fechaInicio + "_" + fechaFin])

        break;
      case "red":
        //https://qajakiro2.zippyttech.com/api/reports/inputs/detail/exportinput/2022-05-20_2022-06-07
        window.open(this.api + 'reports/inputs/detail/exportinput/' + fechaInicio + "_" + fechaFin);
        break;

      case "rsd":
        //https://qajakiro2.zippyttech.com/api/reports/outputs/detail/export/2022-05-20_2022-06-07
        window.open(this.api + 'reports/outputs/detail/export/' + fechaInicio + "_" + fechaFin);
        break;
      default:
        break;

    }



  }

  goToMenu() {
    let info = this.localService.getJsonValue('info');
    if (info.rol.toLowerCase() === 'op_entradas') {
      this.router.navigate(['/dashboard/Entradas'])

    } else {
      this.router.navigate(['/dashboard/Stats'])

    }
  }

  reloadComponent() {
    let refreshUrl2;
    const currentUrl = this.router.url;
    let info = this.localService.getJsonValue('info');
    if (info.rol.toLowerCase() === 'op_entradas') {
      refreshUrl2 = currentUrl.indexOf("/dashboard/Entradas") > -1 ? "/" : "/";
    } else {
      refreshUrl2 = currentUrl.indexOf("/dashboard/Stats") > -1 ? "/" : "/";

    }
    this.router
      .navigateByUrl(refreshUrl2)
      .then(() => this.router.navigateByUrl(currentUrl));
  }
  //*  FUNCION PARA EL FILTRADO DESDE EL SELECTOR DE FECHAS

  public DateFilter(event) {
    //const info = JSON.parse(localStorage.getItem('info'));
    this.contInit = 0;
    this.fechas = event;
    const fechaInicio = this.convertFormat(this.fechas.fromDate);
    const fechaFinal = this.convertFormat(this.fechas.toDate);
    this.fechaExcelInicio = this.convertFormatYear(this.fechas.fromDate);
    this.fechaExcelFin = this.convertFormatYear(this.fechas.toDate);

    console.log(fechaInicio + "_" + fechaFinal)
    //this.loadAll(fechaInicio, fechaFinal);
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
  toModel(date: Date): string | null {
    return date != null ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : null;
  }
  //*  FUNCION PARA EL FILTRADO DESDE EL SELECTOR DE FECHAS

} 
