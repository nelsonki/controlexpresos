import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';
import { LocalService } from '../../../http/httpServices/local-service.service';

@Injectable()
export class UserServices {
    private autorization: any;

    public api: string;
    public local;

    constructor(
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
        let enpoint = 'users/index';
        return this.http.doGet(this.api, enpoint );
    }

    save(body) {
        let enpoint = 'users/store';
        return this.http.doPost(this.api, enpoint, body);
     }

    update(id, body) {
        let enpoint = 'users/update/'+id;
        return this.http.doPut(this.api, enpoint, body);
    }

    delete(id) {
        let enpoint = 'users/delete/'+id;
        return this.http.doDelete(this.api, enpoint);
     }
     logout(){
        let enpoint = 'logout';
        return this.http.doPost(this.api, enpoint,"");
     }

     
}