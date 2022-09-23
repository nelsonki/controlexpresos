import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';
import { LocalService } from '../../../http/httpServices/local-service.service';
import { Router } from '@angular/router';

@Injectable()
export class AdditionalsServices {
    private autorization: any;

    public api: string;
    public local;

    constructor(
        private http: HttpServices,
        private http2: HttpClient,

        public localService: LocalService,
        private router: Router

    ) {
        this.api = environment.apiUrl;
        this.local = this.localService.getJsonValue('info');
        if (this.local !== null) {
            this.autorization = new HttpHeaders({
                'Authorization': `Bearer ` + this.local.data.token,
                'x-timezone': 'America/Caracas,-04:00'
            });
        }
    }

    getList() {
        let enpoint = '/additionals';
        const url = this.api + enpoint;
        return this.http2.get(url, { headers: this.autorization });
    }

    save(body) {
        let enpoint = '/additionals';
        return this.http.doPost(this.api, enpoint, body);
    }

    update(id, body) {
        let enpoint = '/additionals/' + id;
        return this.http.doPut(this.api, enpoint, body);
    }

    delete(id) {
        let enpoint = '/additionals/' + id;
        return this.http.doDelete(this.api, enpoint);
    }


}