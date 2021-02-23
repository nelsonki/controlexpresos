import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';

@Injectable()
export class EntradasServices {
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
        let enpoint = 'inputs/index';
        return this.http.doGet(this.api, enpoint );
    }

    save(body) {
        let enpoint = 'inputs/store';
        return this.http.doPost(this.api, enpoint, body);
     }

    update(id, body) {
        let enpoint = 'inputs/update/'+id;
        return this.http.doPut(this.api, enpoint, body);
    }

    delete(id) {
        let enpoint = 'inputs/delete/'+id;
        return this.http.doDelete(this.api, enpoint);
     }

     
}