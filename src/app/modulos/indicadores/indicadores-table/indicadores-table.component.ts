import { Component, OnInit } from '@angular/core';

import { IndicadoresServices } from '../indicadores-services/indicadores-services';

import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Chart } from 'angular-highcharts';
const pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;

declare var $: any;

@Component({
  selector: 'app-indicadores-table',
  templateUrl: './indicadores-table.component.html',
  styleUrls: ['./indicadores-table.component.scss']
})
export class IndicadoresTableComponent implements OnInit {
  public labelFiltroLi: String = 'Filtrar por año'
  public labelFiltroCo: String = 'Filtrar por año';

  public checkedDateLi = 'dia';
  public checkedDateCo = 'dia';


  public chartLibras;
  public chartCo;

  public dataSource;
  public dataFilter: any;
  public fechas: any;
  public xAxis;
  public element: any;
  public graphicData = [];
  public graphicData2 = [];

  public dateNow = new Date();
  public dayArray = [];
  public dayArrayCo = [];

  public selectedLi: any;
  public selectedMesLi: any;
  public selectedDiaLi: any;

  public selectedCo: any;
  public selectedMesCo: any;
  public selectedDiaCo: any;


  formLibras: FormGroup;
  formConsumido: FormGroup;

  constructor(
    public toaster: ToastrService,
    public fb: FormBuilder,
    public indicadoresServices: IndicadoresServices) {
    this.selectedLi = this.dateNow.getFullYear().toString();
    this.selectedMesLi = pad(this.dateNow.getMonth() + 1).toString();
    this.selectedDiaLi = this.dateNow.getDate().toString();

    this.selectedCo = this.dateNow.getFullYear().toString();
    this.selectedMesCo = pad(this.dateNow.getMonth() + 1).toString();
    this.selectedDiaCo = this.dateNow.getDate().toString();

    this.formLibras = fb.group({
      searchDateByYearLi: ['2022'],
      searchDateByMonthLi: [],
      searchDateByDayLi: [],
      toogleDateLi: ['dia']
    });
    this.formLibras.controls['searchDateByYearLi'].setValue(this.selectedLi);
    this.formLibras.controls['searchDateByMonthLi'].setValue(this.selectedMesLi);
    this.formLibras.controls['searchDateByDayLi'].setValue(this.selectedDiaLi);
    this.cargarDias()

    this.formLibras.controls['toogleDateLi'].setValue('dia');

    this.formConsumido = fb.group({
      searchDateByYearCo: ['2022'],
      searchDateByMonthCo: [],
      searchDateByDayCo: [],
      toogleDateCo: ['dia']
    });

    this.formConsumido.controls['searchDateByYearCo'].setValue(this.selectedCo);
    this.formConsumido.controls['searchDateByMonthCo'].setValue(this.selectedMesCo);
    this.formConsumido.controls['searchDateByDayCo'].setValue(this.selectedDiaCo);
    this.cargarDiasOps()

    this.formConsumido.controls['toogleDateCo'].setValue('dia');

  }
  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.formLibras.controls['toogleDateLi'].valueChanges.subscribe((data: any) => {
      switch (data) {
        case "year":
          this.checkedDateLi = 'year';
          break;
        case "mes":
          this.checkedDateLi = 'mes';
          break;
        case "dia":
          this.checkedDateLi = 'dia';
          break;
        default:
          break;

      }

    });

    this.formConsumido.controls['toogleDateCo'].valueChanges.subscribe((data: any) => {
      switch (data) {
        case "year":
          this.checkedDateCo = 'year';
          break;
        case "mes":
          this.checkedDateCo = 'mes';
          break;
        case "dia":
          this.checkedDateCo = 'dia';
          break;
        default:
          break;

      }
    });

    this.setFilterLibras();
    this.setFilterOps();

  }
  cargarDias() {

    if (this.formLibras.value.toogleDateLi === 'mes' || this.formLibras.value.toogleDateLi === 'dia') {
      let days = []
      this.dayArray = []
      let month = 0;
      month = this.daysInMonth(this.formLibras.value.searchDateByMonthLi, this.formLibras.value.searchDateByYearLi)
      for (let i = 1; i <= month; i++) {
        this.dayArray.push(pad(i))
      }
      //console.log(this.dayArray)

    }

  }
  cargarDiasOps() {

    if (this.formConsumido.value.toogleDateCo === 'mes' || this.formConsumido.value.toogleDateCo === 'dia') {
      let days = []
      this.dayArrayCo = []
      let month = 0;
      month = this.daysInMonth(this.formConsumido.value.searchDateByMonthCo, this.formConsumido.value.searchDateByYearCo)
      for (let i = 1; i <= month; i++) {
        this.dayArrayCo.push(pad(i))
      }
      //console.log(this.dayArrayCo)

    }
  }
  setFilterLibras() {
    let month = 0;
    // recibe el objeto searchDateByYear, searchDateByMonth
    if (this.formLibras.value.searchDateByMonthLi === null && this.formLibras.value.searchDateByYearLi === null) {
      this.toaster.warning("Por favor seleccione un año y un mes")
      return false;
    }
    if (this.formLibras.value.searchDateByMonthLi !== null && this.formLibras.value.searchDateByYearLi === null) {
      this.toaster.warning("Por favor seleccione un año para consultar el mes")
      return false;
    }
    if (this.formLibras.value.toogleDateLi === 'mes' && this.formLibras.value.searchDateByMonthLi === null) {
      this.toaster.warning("Por favor seleccione un mes")
      return false;
    }
    if (this.formLibras.value.toogleDateLi === 'dia' && this.formLibras.value.searchDateByMonthLi === null && this.formLibras.value.searchDateByYearLi !== null) {
      this.toaster.warning("Por favor seleccione un mes para consultar el día")
      return false;
    }
    if (this.formLibras.value.toogleDateLi === 'dia' && this.formLibras.value.searchDateByDayLi === null) {
      this.toaster.warning("Por favor seleccione un dia")
      return false;
    }
    if (this.formLibras.value.toogleDateLi === 'dia') {
      let days = []
      //this.dayArray = []
      month = this.daysInMonth(this.formLibras.value.searchDateByMonthLi, this.formLibras.value.searchDateByYearLi)
      for (let i = 1; i <= month; i++) {
        //this.dayArray.push(i)
        days.push(pad(i));
      }
      this.xAxis = days;
      this.indicadoresServices.getIndicadoresdData(this.formLibras.value.searchDateByMonthLi, this.formLibras.value.searchDateByYearLi, this.formLibras.value.searchDateByDayLi, 'dias', 'quantity').subscribe((response: any) => {
        this.graphicData = [{
          data: response,
          name: "Libras por clientes",
        }
        ];
        //console.log(response)
      }, (error: any) => {
        if (error.status == '404') {
          this.toaster.error("No hay operaciones registradas")

        }
      }, () => {

        //console.log(this.graphicData);
        this.makeGraphLibras('Total de libras por cliente de entradas para el día ' + this.formLibras.value.searchDateByDayLi + ', del mes ' + this.getMonthByNumber(this.formLibras.value.searchDateByMonthLi) + ' ' + this.formLibras.value.searchDateByYearLi, this.xAxis, 'Cantidad', this.graphicData);
      });
    }
    if (this.formLibras.value.toogleDateLi === 'mes') {
      let days = []
      //this.dayArray = []
      month = this.daysInMonth(this.formLibras.value.searchDateByMonthLi, this.formLibras.value.searchDateByYearLi)
      for (let i = 1; i <= month; i++) {
        //this.dayArray.push(i)
        days.push(pad(i));
      }
      this.xAxis = days;
      this.indicadoresServices.getIndicadoresdData(this.formLibras.value.searchDateByMonthLi, this.formLibras.value.searchDateByYearLi, this.formLibras.value.searchDateByDayLi, 'mes', 'quantity').subscribe((response: any) => {
        this.graphicData = [{
          data: response,
          name: "Libras por clientes",
        }
        ];
        // console.log(response)
      }, (error: any) => {
        if (error.status == '404') {
          this.toaster.error("No hay operaciones registradas")

        }
      }, () => {

        // console.log(this.graphicData);
        this.makeGraphLibras('Total de libras por cliente de entradas por  mes ' + this.getMonthByNumber(this.formLibras.value.searchDateByMonthLi) + ' ' + this.formLibras.value.searchDateByYearLi, this.xAxis, 'Cantidad', this.graphicData);
      });
    }
    if (this.formLibras.value.toogleDateLi === 'year') {
      this.xAxis = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      this.indicadoresServices.getIndicadoresdData(this.formLibras.value.searchDateByMonthLi, this.formLibras.value.searchDateByYearLi, this.formLibras.value.searchDateByDayLi, 'year', 'quantity').subscribe((response: any) => {
        this.graphicData = [
          {
            name: "Libras por clientes",
            data: response
          }
        ];
        //console.log(response)
      }, (error: any) => {
        if (error.status == '404') {
          this.toaster.error("No hay operaciones registradas")

        }
      }, () => {
        //console.log(this.graphicData);
        this.makeGraphLibras('Total de libras por cliente de entradas por mes, año ' + this.formLibras.value.searchDateByYearLi, this.xAxis, 'Cantidad', this.graphicData);

      });
    }
  }
  ////////////////////////////7/////////////////////////////
  ////////////////////////////7/////////////////////////////
  ////////////////////////////7/////////////////////////////
  ////////////////////////////7/////////////////////////////

  ////////////////////////////7/////////////////////////////
  setFilterOps() {
    let month = 0;
    // recibe el objeto searchDateByYear, searchDateByMonth
    if (this.formConsumido.value.searchDateByMonthCo === null && this.formConsumido.value.searchDateByYearCo === null) {
      this.toaster.warning("Por favor seleccione un año y un mes")
      return false;
    }
    if (this.formConsumido.value.searchDateByMonthCo !== null && this.formConsumido.value.searchDateByYearCo === null) {
      this.toaster.warning("Por favor seleccione un año para consultar el mes")
      return false;
    }
    if (this.formConsumido.value.toogleDateCo === 'mes' && this.formConsumido.value.searchDateByMonthCo === null) {
      this.toaster.warning("Por favor seleccione un mes")
      return false;
    }
    if (this.formConsumido.value.toogleDateCo === 'dia' && this.formConsumido.value.searchDateByMonthCo === null && this.formConsumido.value.searchDateByYearCo !== null) {
      this.toaster.warning("Por favor seleccione un mes para consultar el día")
      return false;
    }
    if (this.formConsumido.value.toogleDateCo === 'dia' && this.formConsumido.value.searchDateByDayCo === null) {
      this.toaster.warning("Por favor seleccione un dia")
      return false;
    }
    if (this.formConsumido.value.toogleDateCo === 'dia') {
      let days = []
      //this.dayArray = []
      month = this.daysInMonth(this.formConsumido.value.searchDateByMonthCo, this.formConsumido.value.searchDateByYearCo)
      for (let i = 1; i <= month; i++) {
        //this.dayArray.push(i)
        days.push(pad(i));
      }
      this.xAxis = days;
      this.indicadoresServices.getIndicadoresdDataOps(this.formConsumido.value.searchDateByMonthCo, this.formConsumido.value.searchDateByYearCo, this.formConsumido.value.searchDateByDayCo, 'dias', 'quantity').subscribe((response: any) => {
        this.graphicData2 = [{
          data: response,
          name: "Libras por clientes",
        }
        ];
        //console.log(response)
      }, (error: any) => {
        if (error.status == '404') {
          this.toaster.error("No hay operaciones registradas")

        }
      }, () => {

        //console.log(this.graphicData2);
        this.makeGraphCo('Total de consumido para el día ' + this.formConsumido.value.searchDateByDayCo + ', del mes ' + this.getMonthByNumber(this.formConsumido.value.searchDateByMonthCo) + ' ' + this.formConsumido.value.searchDateByYearCo, this.xAxis, 'Cantidad', this.graphicData2);
      });
    }
    if (this.formConsumido.value.toogleDateCo === 'mes') {
      let days = []
      //this.dayArray = []
      month = this.daysInMonth(this.formConsumido.value.searchDateByMonthCo, this.formConsumido.value.searchDateByYearCo)
      for (let i = 1; i <= month; i++) {
        //this.dayArray.push(i)
        days.push(pad(i));
      }
      this.xAxis = days;
      this.indicadoresServices.getIndicadoresdDataOps(this.formConsumido.value.searchDateByMonthCo, this.formConsumido.value.searchDateByYearCo, this.formConsumido.value.searchDateByDayCo, 'mes', 'quantity').subscribe((response: any) => {
        this.graphicData2 = [{
          data: response,
          name: "Libras por clientes",
        }
        ];
        // console.log(response)
      }, (error: any) => {
        if (error.status == '404') {
          this.toaster.error("No hay operaciones registradas")

        }
      }, () => {

        // console.log(this.graphicData2);
        this.makeGraphCo('Total de consumido por  mes ' + this.getMonthByNumber(this.formConsumido.value.searchDateByMonthCo) + ' ' + this.formConsumido.value.searchDateByYearCo, this.xAxis, 'Cantidad', this.graphicData2);
      });
    }
    if (this.formConsumido.value.toogleDateCo === 'year') {
      this.xAxis = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      this.indicadoresServices.getIndicadoresdDataOps(this.formConsumido.value.searchDateByMonthCo, this.formConsumido.value.searchDateByYearCo, this.formConsumido.value.searchDateByDayCo, 'year', 'quantity').subscribe((response: any) => {
        this.graphicData2 = [
          {
            name: "Libras por clientes",
            data: response
          }
        ];
        //console.log(response)
      }, (error: any) => {
        if (error.status == '404') {
          this.toaster.error("No hay operaciones registradas")

        }
      }, () => {
        //console.log(this.graphicData2);
        this.makeGraphCo('Total de consumido por mes, año ' + this.formConsumido.value.searchDateByYearCo, this.xAxis, 'Cantidad', this.graphicData2);

      });
    }
  }


  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  getMonthByNumber(monthNumber) {
    let mes = '';
    switch (monthNumber) {
      case '01':
        mes = 'enero';
        break;
      case '02':
        mes = 'febrero';
        break;
      case '03':
        mes = 'marzo';
        break;
      case '04':
        mes = 'abril';
        break;
      case '05':
        mes = 'mayo';
        break;
      case '06':
        mes = 'junio';
        break;
      case '07':
        mes = 'julio';
        break;
      case '08':
        mes = 'agosto';
        break;
      case '09':
        mes = 'septiembre';
        break;
      case '10':
        mes = 'octubre';
        break;
      case '11':
        mes = 'noviembre';
        break;
      case '12':
        mes = 'diciembre';
        break;
    }
    return mes;
  }


  makeGraphLibras(title?, xAxis?, yAxisText?, data?) {

    this.chartLibras = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: title
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Libras',
        colorByPoint: true,
        type: undefined,
        data: data[0]['data']
      }]
    });
  }

  makeGraphCo(title?, xAxis?, yAxisText?, data?) {
    console.log(data[0]['data']['datos'])
    this.chartCo = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: title + '<br> <b>Creadas: </b>' + data[0]['data'].creadas + '<b>, Esperadas: </b> ' + data[0]['data'].esperadas
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y:.1f} %'
          }
        }
      },
      series: [{
        name: 'Consumido',
        colorByPoint: true,
        type: undefined,
        data: [data[0]['data']['datos']]
      }]
    });
  }


}
