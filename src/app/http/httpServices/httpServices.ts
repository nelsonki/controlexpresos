import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { contentHeaders } from './headers/headers';

@Injectable()
export class HttpServices {
 
    constructor(
        private http: HttpClient
    ) {
    }

    doGet(api: string, endpoint: string) {
        const url = api + endpoint;
        return this.http.get(url, {headers: contentHeaders });
    }

    doPost(api: string, endpoint: string, body:any) {
        const url = api + endpoint;
        return this.http.post(url, body, {headers: contentHeaders});
    }

    doPut(api: string, endpoint: string, body:any) {
        const url = api + endpoint;
        return this.http.put(url, body, {headers: contentHeaders});
    }

    doDelete(api: string, endpoint: string) {
        const url = api + endpoint;
        return this.http.delete(url, {headers: contentHeaders});
    }
 

}
