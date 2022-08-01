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

    getList(fechaInicio?, fechaFin?, cliente?, sucursal?) {
        let enpoint;
        let vieneCliente = (cliente ? cliente : 0)
        let vieneSucursal = (sucursal ? sucursal : 0)
        if ((fechaInicio && fechaFin) || vieneCliente || vieneSucursal) {

            if (fechaInicio === "" && fechaFin === "") {
                enpoint = `outputs/index/in_course?client_id=${vieneCliente}&branch_id=${vieneSucursal}`;

            } else {
                if (fechaInicio === fechaFin) {
                    enpoint = `outputs/index/in_course?day=${fechaInicio}&client_id=${vieneCliente}&branch_id=${vieneSucursal} `;
                } else {
                    enpoint = `outputs/index/in_course?interval=${fechaInicio}_${fechaFin}&client_id=${vieneCliente}&branch_id=${vieneSucursal}`;
                }
            }
        } else {
            enpoint = 'outputs/index/in_course';
        }
        console.log(enpoint)
        return this.http.doGet(this.api, enpoint);
    }



    getOperaciones(fechaInicio?, fechaFin?, id?) {
        let idViene = (id) ? id : 0
        console.log(idViene)
        let enpoint;
        if (idViene > 0) {
            //enpoint = 'outputs/index/processed?client_id=' + idViene;
            if (fechaInicio === "" && fechaFin === "") {
                enpoint = 'outputs/index/processed?client_id=' + idViene;
                console.log(enpoint)

            } else {
                if (fechaInicio === fechaFin) {
                    enpoint = 'outputs/index/processed?client_id=' + idViene + '&day=' + fechaInicio;
                    console.log(enpoint)

                } else {
                    enpoint = 'outputs/index/processed?client_id=' + idViene + '&interval=' + fechaInicio + "_" + fechaFin;
                    console.log(enpoint)

                }
            }
        } else {
            if (fechaInicio === "" && fechaFin === "") {
                enpoint = 'outputs/index/processed';
                console.log(enpoint)

            } else {
                if (fechaInicio === fechaFin) {
                    enpoint = 'outputs/index/processed?day=' + fechaInicio;
                    console.log(enpoint)

                } else {
                    enpoint = 'outputs/index/processed?interval=' + fechaInicio + "_" + fechaFin;
                    console.log(enpoint)

                }
            }
        }




        return this.http.doGet(this.api, enpoint);
    }
    getList2(fechaInicio?, fechaFin?) {
        let enpoint;
        if (fechaInicio === fechaFin) {
            enpoint = 'outputs/index/in_course/' + fechaInicio + "_" + fechaFin;
        } else {
            enpoint = 'outputs/index/in_course/' + fechaInicio;

        }
        return this.http.doGet(this.api, enpoint);
    }
    getLastGroup() {
        let enpoint = 'outputs/lastGroupId';
        return this.http.doGet(this.api, enpoint);
    }
    /*getOperaciones()
    {
        let enpoint = 'outputs/index/processed';
        return this.http.doGet(this.api, enpoint );
    }*/
    cancelarProcesadas(id, body) {
        let enpoint = 'inputs/cancel/' + id;
        return this.http.doPut(this.api, enpoint, body);
    }
    procesar(id, body) {
        let enpoint = 'inputs/process/' + id;
        return this.http.doPut(this.api, enpoint, body);
    }
    save(body) {
        let enpoint = 'outputs/store';
        return this.http.doPost(this.api, enpoint, body);
    }

    update(id, body) {
        let enpoint = 'outputs/update/' + id;
        return this.http.doPut(this.api, enpoint, body);
    }

    delete(id, modulo) {
        if (modulo === "delete") {
            let enpoint = 'outputs/delete/' + id;
            return this.http.doDelete(this.api, enpoint);
        }
        if (modulo === "deleteOp") {
            let enpoint = 'outputs/deleteOp/' + id;
            return this.http.doDelete(this.api, enpoint);
        }
        if (modulo === "deleteGrupo") {
            let enpoint = 'outputs/deletePartials/' + id;
            return this.http.doDelete(this.api, enpoint);
        }
    }

}