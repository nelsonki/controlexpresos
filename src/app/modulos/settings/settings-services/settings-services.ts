import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';
import { HttpClient } from '@angular/common/http';
import { LocalService } from '../../../http/httpServices/local-service.service';

@Injectable()
export class SettingsServices {
  private autorization: any;

  public api: string;
  public local;
  constructor(
    private _http: HttpClient,

    private http: HttpServices,
    public localService: LocalService
  ) {
    this.api = environment.apiUrl;
    this.local = this.localService.getJsonValue('info');
    if (this.local !== null) {
      this.autorization = new HttpHeaders({
        'Authorization': 'Bearer ' + this.local.session.original.token,
        'x-timezone': 'America/Caracas,-04:00'
      });
    }
  }

  getList() {
    let enpoint = 'config/index';
    return this.http.doGet(this.api, enpoint);
  }
  save(body) {
    let enpoint = 'config/store';
    return this.http.doPost(this.api, enpoint, body);
  }

  update(id, body) {
    let enpoint = 'config/update/' + id;
    return this.http.doPut(this.api, enpoint, body);
  }

}