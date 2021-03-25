import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StatsServices {
    private autorization: any;

    public api: string;

    constructor(
        private _http: HttpClient,

        private http: HttpServices,
        //public localService: LocalService
    ) {
        this.api = environment.apiJakiro2;
        //this.local = this.localService.getJsonValue('info');
        /*if (this.local !== null) {
            this.autorization = new HttpHeaders({
                'Authorization': 'Bearer ' + this.local.token,
                'x-timezone': 'America/Caracas,-04:00'
            });
        }*/
    }

    getList() {
        let enpoint = 'outputs/index';
        return this.http.doGet(this.api, enpoint );
    }
    getOperaciones()
    {
        let enpoint = 'outputs/index/processed';
        return this.http.doGet(this.api, enpoint );
    }
    
    /*getDashboardUser(month, year, filter) {  
        console.log(month, year, filter);
        let endpoint = '';
        if (filter === "annio") {
          endpoint = `dashboard/chart/${year}`;
        } else {
          endpoint = `dashboard/chart/${year}/${month}`;
        }
        return this._http.get(this.api + endpoint, { headers: this.autorization });
    } */
       getDashboardData(month, year, filter, parametro) {
        console.log(month, year, filter, parametro);
        let endpoint = '';
        if (filter === "annio") {
          endpoint = `dashboard/index2/${parametro}/${year}`;
        } else {
          endpoint = `dashboard/index/${parametro}/${month}/${year}`;
        }
        return this._http.get(this.api + endpoint, { headers: this.autorization });
      }
      /*postdevice(env) {
        let endpoint = `mng/v1/act`;
        return this.http.abrirDevice(this.apiDevice + endpoint, env);
      }*/
     
}