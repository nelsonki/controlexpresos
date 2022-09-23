import { Injectable } from '@angular/core';
import { contentHeaders } from './headers/headers';
import { LocalService } from './local-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpServices {
    private autorization: any;
    private autorization2: any;

    public userName;
    public local;
    constructor(
        private http: HttpClient,
        public localService: LocalService
    ) {
        // let info = JSON.parse(localStorage.getItem('info'));
        //let info = this.localService.getJsonValue('info');
        this.local = this.localService.getJsonValue('info');
        if (this.local !== null) {
            this.autorization = new HttpHeaders({
                'Authorization': `Bearer ` + this.local.data.token,
                'x-timezone': 'America/Caracas,-04:00'
            });
        }
    }
    //                'Authorization': 'Bearer ' + this.local.token,

    doGet(api: string, endpoint: string) {
        const url = api + endpoint;
        return this.http.get(url, { headers: this.autorization });
    }

    doPost(api: string, endpoint: string, body: any) {
        const url = api + endpoint;
        return this.http.post(url, body, { headers: this.autorization });
    }

    doPut(api: string, endpoint: string, body: any) {
        const url = api + endpoint;
        return this.http.put(url, body, { headers: this.autorization });
    }

    doDelete(api: string, endpoint: string) {
        const url = api + endpoint;
        return this.http.delete(url, { headers: this.autorization });
    }
    abrirDevice(url, env) {
        return this.http.post(url, env);
    }

}
