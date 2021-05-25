import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpServices } from '../../../http/httpServices/httpServices';

@Injectable()
export class SalidasServices {
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

    getList(fechaInicio?, fechaFin?) {
        let enpoint;

    if(fechaInicio==="" && fechaFin===""){
        enpoint = 'outputs/index';
    }else{
        if(fechaInicio === fechaFin){
            enpoint = 'outputs/index/?day='+fechaInicio;
       }else{
            enpoint = 'outputs/index/?interval='+fechaInicio+"_"+fechaFin;
        }  
    }
       

        return this.http.doGet(this.api, enpoint );
    }
    getOperaciones(fechaInicio?, fechaFin?) {
        let enpoint;

    if(fechaInicio==="" && fechaFin===""){
        enpoint = 'outputs/index';
    }else{
        if(fechaInicio === fechaFin){
            enpoint = 'outputs/index/processed/?day='+fechaInicio;
       }else{
            enpoint = 'outputs/index/processed/?interval='+fechaInicio+"_"+fechaFin;
        }  
    }
       

        return this.http.doGet(this.api, enpoint );
    }
    getList2(fechaInicio?, fechaFin?) {
        let enpoint;
    if(fechaInicio === fechaFin){
         enpoint = 'outputs/index/'+fechaInicio+"_"+fechaFin;
    }else{
         enpoint = 'outputs/index/'+fechaInicio;

    }
        return this.http.doGet(this.api, enpoint );
    }
    /*getOperaciones()
    {
        let enpoint = 'outputs/index/processed';
        return this.http.doGet(this.api, enpoint );
    }*/
    procesar(id, body){
        let enpoint = 'inputs/process/'+id;
        return this.http.doPut(this.api, enpoint, body);
    }
    save(body) {
        let enpoint = 'outputs/store';
        return this.http.doPost(this.api, enpoint, body);
     }

    update(id, body) {
        let enpoint = 'outputs/update/'+id;
        return this.http.doPut(this.api, enpoint, body);
    }
 
    delete(id, modulo) {
        if(modulo === "delete"){
           let enpoint = 'outputs/delete/'+id;
           return this.http.doDelete(this.api, enpoint); 
       }
       if(modulo === "deleteOp"){
           let enpoint = 'outputs/deleteOp/'+id;
           return this.http.doDelete(this.api, enpoint); 
       }
       
    }
     
}