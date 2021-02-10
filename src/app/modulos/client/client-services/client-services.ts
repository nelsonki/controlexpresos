import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';

@Injectable()
export class ClientServices {
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
        let enpoint = 'clients/index';
        return this.http.doGet(this.api, enpoint );
    }

    save(body) {
        return this.http.doPost('categories', body, this.api);
    }

    update(id, body) {
        return this.http.doPut(this.api, 'categories/' + id, body);
    }

    delete(id) {
        return this.http.doDelete(this.api, 'categories/'+ id);
    }

     
}