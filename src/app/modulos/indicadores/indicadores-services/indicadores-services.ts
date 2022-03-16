import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';
import { HttpClient } from '@angular/common/http';
import { LocalService } from '../../../http/httpServices/local-service.service';

@Injectable()
export class IndicadoresServices {
  private autorization: any;

  public api: string;
  public local;
  constructor(
    private _http: HttpClient,

    private http: HttpServices,
    public localService: LocalService
  ) {
    this.api = environment.apiJakiro2;
    this.local = this.localService.getJsonValue('info');
    if (this.local !== null) {
      this.autorization = new HttpHeaders({
        'Authorization': 'Bearer ' + this.local.session.original.token,
        'x-timezone': 'America/Caracas,-04:00'
      });
    }
  }

  getList() {
    let enpoint = 'outputs/index';
    return this.http.doGet(this.api, enpoint);
  }
  getOperaciones() {
    let enpoint = 'outputs/index/processed';
    return this.http.doGet(this.api, enpoint);
  }

  getIndicadoresdData(month, year, dia, filter, parametro) {
    console.log(month, year, dia, filter, parametro);
    let endpoint = '';
    //https://qajakiro2.zippyttech.com/api/dashboard/cakeChart
    if (filter === "dias") {
      endpoint = `dashboard/cakeChart?day=${year}-${month}-${dia}`;
    }
    if (filter === "year") {
      endpoint = `dashboard/cakeChart?year=${year}`;
    }
    if (filter === "mes") {

      endpoint = `dashboard/cakeChart?year=${year}&month=${month}`;
    }
    return this._http.get(this.api + endpoint, { headers: this.autorization });
  }
  getIndicadoresdDataOps(month, year, dia, filter, parametro) {
    console.log(month, year, dia, filter, parametro);
    let endpoint = '';
    //https://qajakiro2.zippyttech.com/api/dashboard/cakeChart
    if (filter === "dias") {
      endpoint = `dashboard/cakeChartOpsByDay?day=${year}-${month}-${dia}`;
    }
    /*
    if (filter === "year") {
      endpoint = `dashboard/cakeChart?year=${year}`;
    }
    if (filter === "mes") {

      endpoint = `dashboard/cakeChart?year=${year}&month=${month}`;
    }*/
    return this._http.get(this.api + endpoint, { headers: this.autorization });
  }
}