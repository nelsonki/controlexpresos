import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';

@Injectable()
export class BranchServices {
    private autorization: any;

    public api: string;

    constructor(
        private http: HttpServices,
        //public localService: LocalService
    ) {
        this.api = environment.apiUrl;
        //this.local = this.localService.getJsonValue('info');
        /*if (this.local !== null) {
            this.autorization = new HttpHeaders({
                'Authorization': 'Bearer ' + this.local.token,
                'x-timezone': 'America/Caracas,-04:00'
            });
        }*/
    }

    getList() {
        let enpoint = 'branches/index';
        return this.http.doGet(this.api, enpoint);
    }
    getListIdCliente(id) {
        //branches/search/{nombre de la sucursal}/{id del cliente}
        let enpoint = 'branches/search/' + id;
        return this.http.doGet(this.api, enpoint);
    }
    getListIdClienteSinEntrada(id) {
        //branches/search/{nombre de la sucursal}/{id del cliente}
        let enpoint = 'branches/sort/' + id;
        return this.http.doGet(this.api, enpoint);
    }
    save(body) {
        let enpoint = 'branches/store';
        return this.http.doPost(this.api, enpoint, body);
    }

    update(id, body) {
        let enpoint = 'branches/update/' + id;
        return this.http.doPut(this.api, enpoint, body);
    }

    delete(id) {
        let enpoint = 'branches/delete/' + id;
        return this.http.doDelete(this.api, enpoint);
    }


}