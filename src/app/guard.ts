import { CanActivate, CanActivateChild, CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalService } from 'src/app/http/httpServices/local-service.service';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate, CanActivateChild, CanDeactivate<true> {

    constructor( private localService: LocalService, private router: Router,     public toasTer: ToastrService,
        ) { }

    canActivate() {
        let info = this.localService.getJsonValue('info');
        // If the user is not logged in we'll send them back to the home page
        if (!info ) {
            console.log('Debe iniciar sesión');
            this.toasTer.error('Debe iniciar sesión primero');
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
    canActivateChild() {
        let info = this.localService.getJsonValue('info');
        // If the user is not logged in we'll send them back to the home page
        if (info.rol ==="operador" ) {
            console.log('No tiene acceso');
            this.toasTer.error('No tiene acceso a este módulo');

            this.router.navigate(['/dashboard/Stats']);
            return false;
        }
        return true;
    }
    canDeactivate() {
        let info = this.localService.getJsonValue('info');
        // If the user is not logged in we'll send them back to the home page
        if (info.rol ==="op. entradas" ) {
            console.log('No tiene acceso');
            this.toasTer.error('No tiene acceso a este módulo');

            this.router.navigate(['/dashboard/Stats']);
            return false;
        }
        return true;
    }
}
