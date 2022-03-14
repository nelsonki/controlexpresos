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

  public checkedDateLi = 'year';
  public checkedDateCo: Boolean = true;

  public abridorArray = [];

  public chartLibras;

  public dataSource;
  public dataFilter: any;
  public fechas: any;
  public xAxis;
  public element: any;
  public graphicData = [];
  public graphicData2 = [];

  public dateNow = new Date();
  public dayArray = [];

  public selected: any;
  columnsToDisplay = [
    "Item",
    "Nombre de Usuario",
    "Tipo de Usuario",
    "Vehículo",
    "Fecha de entrada"
  ];
  formLibras: FormGroup;
  formConsumido: FormGroup;

  constructor(
    public toaster: ToastrService,
    public fb: FormBuilder,
    public indicadoresServices: IndicadoresServices) {
    this.selected = this.dateNow.getFullYear().toString();

    this.formLibras = fb.group({
      searchDateByYearLi: ['2021'],
      searchDateByMonthLi: [],
      searchDateByDayLi: [],
      toogleDateLi: [true]
    });
    this.formLibras.controls['searchDateByYearLi'].setValue(this.selected);
    this.formLibras.controls['toogleDateLi'].setValue('year');

    this.formConsumido = fb.group({
      searchDateByYearCo: ['2021'],
      searchDateByMonthCo: [],
      toogleDateCo: [true]
    });
    this.formConsumido.controls['searchDateByYearCo'].setValue(this.selected);



  }
  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.formLibras.controls['toogleDateLi'].valueChanges.subscribe((data: any) => {
      //console.log(data)
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
      /* if (data === false) {
         this.labelFiltroLi = 'Filtrar por mes';
         this.checkedDateLi = false;
       } else {
         this.labelFiltroLi = 'Filtrar por año';
         this.checkedDateLi = true;
       }*/
    });

    this.formConsumido.controls['toogleDateCo'].valueChanges.subscribe((data: any) => {
      if (data === false) {
        this.labelFiltroCo = 'Filtrar por mes';
        this.checkedDateCo = false;
      } else {
        this.labelFiltroCo = 'Filtrar por año';
        this.checkedDateCo = true;
      }
    });

    this.setFilterLibras();
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

      }, () => {

        //console.log(this.graphicData);
        this.makeGraphLibras('Total de libras por cliente de salidas por día, mes ' + this.getMonthByNumber(this.formLibras.value.searchDateByMonthLi) + ' ' + this.formLibras.value.searchDateByYearLi, this.xAxis, 'Cantidad', this.graphicData);
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

      }, () => {

        // console.log(this.graphicData);
        this.makeGraphLibras('Total de libras por cliente de salidas por día, mes ' + this.getMonthByNumber(this.formLibras.value.searchDateByMonthLi) + ' ' + this.formLibras.value.searchDateByYearLi, this.xAxis, 'Cantidad', this.graphicData);
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

      }, () => {
        //console.log(this.graphicData);
        this.makeGraphLibras('Total de libras por cliente de salidas por mes, año ' + this.formLibras.value.searchDateByYearLi, this.xAxis, 'Cantidad', this.graphicData);

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
    console.log(data)
    console.log(data[0]['data'])
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




}
