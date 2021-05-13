import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable , ɵɵresolveBody } from '@angular/core';


import { LocalService } from './local-service.service';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private autorization: any;
  public userName;
  private firebase: any;
   public local;
  constructor(public httpService: HttpClient, public localService: LocalService) {
    // let info = JSON.parse(localStorage.getItem('info'));
    //let info = this.localService.getJsonValue('info');
    this.local = this.localService.getJsonValue('info');
    if (this.local !== null) {
      this.autorization = new HttpHeaders({
        'Authorization': 'Bearer ' + this.local.session.original.token,
        'x-timezone': 'America/Caracas,-04:00'
      });
    }
  }
  // doPut(api: string, endpoint: string, body) {
  //const url = api + endpoint;
  //return this.httpService.put(url, body, { headers: this.autorization });
  // }
  doPut(api: string, endpoint: string, body, usernick) {
    let url = (api + endpoint + '/' + usernick)
    return this.httpService.put(url, body, { headers: this.autorization });
  }


  doGet(endpoint: string, api: string) {
    let url = api + endpoint;
    //console.log(url);
    return this.httpService.get(url, { headers: this.autorization });
  }
 
 
  doGetSinToken(endpoint: string, api: string) {
    let url = api + endpoint;
    return this.httpService.get(url);
  }
  doPost(endpoint: string, body, api: string) {
    let url = api + endpoint;
    return this.httpService.post(url, body);
  }
  doPostReport(endpoint: string, body, api: string) {
    let url = api + endpoint;
    return this.httpService.post(url, body, { headers: this.autorization });
  }
  doDelete(api: string, endpoint: string, id: number) {
    const url = api + endpoint + id;
    return this.httpService.delete(url, { headers: this.autorization });
  }
  doPostFirebase(endpoint: string, body, api: string, token) {
    this.firebase = new HttpHeaders({
      'Authorization': token
    })
    let url = api + endpoint;
    let query = this.httpService.post(url, body, { headers: this.firebase });
    return query;
  }

  doUpdate(api: string, endpoint: string, body) {
    const url = api + endpoint;
    return this.httpService.put(url, body, { headers: this.autorization });
  }

  //https://devus.zippyttech.com/us/social/login
  getUser(api) {
    var info = this.localService.getJsonValue('info');
    console.log('the info', info)
    if (info !== undefined) {
      this.userName = (info.fullname !== undefined) ? info.fullname : info;

    } else {
      this.userName = (info.fullname !== undefined) ? info.fullname : info;

    }

    let endpoint = api + 'users/search/' + this.userName;
    //console.log(endpoint)
    return this.httpService.get(endpoint, { headers: this.autorization });
  }
  
  getAccountData(api, endpoint) {
    let url = api + endpoint;
    return this.httpService.get(url);
  }
  
  checkRole() {
    let info = this.localService.getJsonValue('info');
    if (info.rol) {
      if (info.rol.toLowerCase() === 'admin') {
        return true;
      } else {
        return false;
      }
    } else {
      if (info.User.rol[0].name.toLowerCase() === 'admin') {
        return true;
      } else {
        return false;
      }
    }
  }

}
