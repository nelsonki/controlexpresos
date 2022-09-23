import { Component, OnInit } from '@angular/core';
import { StatsServices } from '../stats-services/stats-services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Chart } from 'angular-highcharts';
import { UserServices } from '../../user/user-services/user-services'
import { DriversServices } from '../../drivers/drivers-services/drivers-services'
import { PartnersServices } from '../../partners/partners-services/partners-services'
import { VehiclesServices } from '../../vehicles/vehicles-services/vehicles-services'
import { OfficesServices } from '../../offices/offices-services/offices-services'
import { LiquidationsServices } from '../../liquidations/liquidations-services/liquidations-services'
declare var $: any;

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrls: ['./stats-table.component.scss']
})
export class StatsTableComponent implements OnInit {
  public labelFiltroUser: String = 'Filtrar por año'

  public labelFiltro: String = 'Filtrar por año';
  public checkedDate: Boolean = true;
  public checkedDate2: Boolean = true;
  public abridorArray = [];
  public chartUser;
  public chart;

  public dataSource;
  public dataFilter: any;
  public fechas: any;
  public xAxis;
  public element: any;
  public graphicData = [];
  public graphicData2 = [];

  public dateNow = new Date();
  public selected: any;
  columnsToDisplay = [
    "Item",
    "Nombre de Usuario",
    "Tipo de Usuario",
    "Vehículo",
    "Fecha de entrada"
  ];
  formUser: FormGroup;
  formPay: FormGroup;
  public totalUsuarios = 0
  public totalChoferes = 0
  public totalVehiculos = 0
  public totalOficinas = 0
  public totalSocios = 0
  public totalViajes = 0
  public totalViajesLiquidacion = 0
  public totalViajesEnCurso = 0
  public fInicio = ""
  public fFin = ""
  constructor(
    public toaster: ToastrService,
    public fb: FormBuilder,
    public statsServices: StatsServices,
    private userServices: UserServices,
    private driversServices: DriversServices,
    private partnersServices: PartnersServices,
    private vehiclesServices: VehiclesServices,
    private officesServices: OfficesServices,
    private liquidationsServices: LiquidationsServices
  ) {
    /*
  this.selected = this.dateNow.getFullYear().toString();
  
  this.formUser = fb.group({
    searchDateByYear: ['2021'],
    searchDateByMonth: [],
    toogleDate: [true]
  });
  this.formUser.controls['searchDateByYear'].setValue(this.selected);

  this.formPay = fb.group({
    searchDateByYear: ['2021'],
    searchDateByMonth: [],
    toogleDate2: [true]
  });
  this.formPay.controls['searchDateByYear'].setValue(this.selected);


*/
  }
  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.userServices.getList().subscribe((value) => {
      this.totalUsuarios = value["data"].length
      console.log(this.totalUsuarios)
    })
    this.driversServices.getList().subscribe((value) => {
      this.totalChoferes = value["data"].length
      console.log(this.totalChoferes)
    })
    this.partnersServices.getList().subscribe((value) => {
      this.totalSocios = value["data"].length
      console.log(this.totalSocios)
    })
    this.vehiclesServices.getList().subscribe((value) => {
      this.totalVehiculos = value["data"].length
      console.log(this.totalVehiculos)
    })
    this.officesServices.getList().subscribe((value) => {
      this.totalOficinas = value["data"].length
      console.log(this.totalOficinas)
    })
    this.liquidationsServices.getListTravels(this.fInicio, this.fFin).subscribe((value) => {
      console.log(value["data"])

      Object.keys(value["data"]).forEach(e => {
        if (value["data"][e].status == 'Finalizado') {
          console.log(value["data"][e])

          this.totalViajes = this.totalViajes + 1
          this.totalViajesLiquidacion = this.totalViajesLiquidacion + value["data"][e].total

        }
        if (value["data"][e].status == 'En Viaje') {

          this.totalViajesEnCurso = this.totalViajesEnCurso + 1

        }
      })

    })
    /*
    this.formUser.controls['toogleDate'].valueChanges.subscribe((data: any) => {
      if (data === false) {
        this.labelFiltroUser = 'Filtrar por mes';
        this.checkedDate = false;
      } else {
        this.labelFiltroUser = 'Filtrar por año';
        this.checkedDate = true;
      }
    });

    this.formPay.controls['toogleDate2'].valueChanges.subscribe((data: any) => {
      if (data === false) {
        this.labelFiltro = 'Filtrar por mes';
        this.checkedDate2 = false;
      } else {
        this.labelFiltro = 'Filtrar por año';
        this.checkedDate2 = true;
      }
    });


    this.setFilterUser();
    this.setFilter();*/
  }
  setFilterUser() {
    let month = 0;
    if (this.formUser.value.searchDateByMonth === null && this.formUser.value.searchDateByYear === null) {
      this.toaster.warning("Por favor seleccione un año y un mes")
      return false;
    }
    if (this.formUser.value.searchDateByMonth !== null && this.formUser.value.searchDateByYear === null) {
      this.toaster.warning("Por favor seleccione un año para consultar el mes")
      return false;
    }
    if (this.formUser.value.toogleDate === false && this.formUser.value.searchDateByMonth === null) {
      this.toaster.warning("Por favor seleccione un un mes")
      return false;
    }
    if (this.formUser.value.toogleDate === false) {
      let days = []
      month = this.daysInMonth(this.formUser.value.searchDateByMonth, this.formUser.value.searchDateByYear)
      for (let i = 1; i <= month; i++) {
        days.push(i);
      }
      this.xAxis = days;
      this.statsServices.getDashboardData(this.formUser.value.searchDateByMonth, this.formUser.value.searchDateByYear, 'dias', 'quantity').subscribe((response: any) => {
        this.graphicData = [{
          data: response,
          name: "Operaciones de salidas Registradas",
        }
        ];
        console.log(response)
      }, (error: any) => {

      }, () => {

        console.log(this.graphicData);
        this.makeGraphUser('Total de Operaciones de salidas por día, mes ' + this.getMonthByNumber(this.formUser.value.searchDateByMonth) + ' ' + this.formUser.value.searchDateByYear, this.xAxis, 'Cantidad', this.graphicData);
      });
    } else {
      this.xAxis = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      this.statsServices.getDashboardData(this.formUser.value.searchDateByMonth, this.formUser.value.searchDateByYear, 'annio', 'quantity').subscribe((response: any) => {
        this.graphicData = [
          {
            name: "Operaciones de salidas Registradas",
            data: response
          }
        ];
        console.log(response)
      }, (error: any) => {

      }, () => {
        this.makeGraphUser('Total de Operaciones de salidas por mes, año ' + this.formUser.value.searchDateByYear, this.xAxis, 'Cantidad', this.graphicData);

      });
    }
  }

  setFilter() {
    let month = 0;
    if (this.formPay.value.searchDateByMonth === null && this.formPay.value.searchDateByYear === null) {
      this.toaster.warning("Por favor seleccione un año y un mes")
      return false;
    }
    if (this.formPay.value.searchDateByMonth !== null && this.formPay.value.searchDateByYear === null) {
      this.toaster.warning("Por favor seleccione un año para consultar el mes")
      return false;
    }
    if (this.formPay.value.toogleDate2 === false && this.formPay.value.searchDateByMonth === null) {
      this.toaster.warning("Por favor seleccione un un mes")
      return false;
    }
    if (this.formPay.value.toogleDate2 === false) {
      let days = []
      month = this.daysInMonth(this.formPay.value.searchDateByMonth, this.formPay.value.searchDateByYear)
      for (let i = 1; i <= month; i++) {
        days.push(i);
      }
      this.xAxis = days;
      this.statsServices.getDashboardData(this.formPay.value.searchDateByMonth, this.formPay.value.searchDateByYear, 'dias', 'weight').subscribe((response: any) => {
        this.graphicData2 = [{
          data: response,
          name: "Pesos",
        }
        ];
        console.log(response)
      }, (error: any) => {

      }, () => {

        console.log(this.graphicData2);
        this.makeGraph('Total de pesos por día, mes ' + this.getMonthByNumber(this.formPay.value.searchDateByMonth) + ' ' + this.formPay.value.searchDateByYear, this.xAxis, 'Cantidad ', this.graphicData2);
      });
    } else {
      this.xAxis = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      this.statsServices.getDashboardData(this.formPay.value.searchDateByMonth, this.formPay.value.searchDateByYear, 'annio', 'weight').subscribe((response: any) => {
        this.graphicData2 = [
          {
            name: "Pesos",
            data: response
          }
        ];
        console.log(response)
      }, (error: any) => {

      }, () => {
        console.log(this.graphicData2);
        this.makeGraph('Total de pesos por mes, año ' + this.formPay.value.searchDateByYear, this.xAxis, 'Cantidad', this.graphicData2);

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

  makeGraphUser(title, xAxis, yAxisText, data) {
    this.chartUser = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: title
      },
      xAxis: { categories: xAxis },
      yAxis: {
        title: {
          text: yAxisText
        }
      },
      series: data
    });
  }

  makeGraph(title, xAxis, yAxisText, data) {
    this.chart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: title
      },
      xAxis: { categories: xAxis },
      yAxis: {
        title: {
          text: yAxisText
        }
      },
      series: data
    });
  }




}
