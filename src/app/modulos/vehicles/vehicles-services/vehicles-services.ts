import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';

@Injectable()
export class VehiclesServices {
    private autorization: any;

    public api: string;

    constructor(
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
        let enpoint = 'vehicles';
        return this.http.doGet(this.api, enpoint);
    }

    save(body) {
        let enpoint = 'vehicles';
        return this.http.doPost(this.api, enpoint, body);
    }

    update(id, body) {
        let enpoint = 'vehicles/' + id;
        return this.http.doPut(this.api, enpoint, body);
    }

    delete(id) {
        let enpoint = 'vehicles/' + id;
        return this.http.doDelete(this.api, enpoint);
    }


}