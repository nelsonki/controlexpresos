import * as animations from './../../../routerAnimations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';

import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../../http/httpServices/local-service.service';

import { UserServices } from '../../user/user-services/user-services'

declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [ // aqui iran nuestras animaciones
    // fader,
    // slider,
    // transformer,
    animations.fader
  ]
})
export class DashboardComponent implements OnInit {



  @ViewChild('drawer') 'drawer': MatDrawer;
  public name;
  public userProfileImage;
  public userLoggedSocial;
  public userLoggedIN;
  public role;

  links = [
    {
      name: "Inicio",
      url: ""
    },
    {
      name: "Lista",
      url: "list"
    },
    {
      name: "Formulario",
      url: "form"
    }
  ];
  constructor(
    public localService: LocalService,
    public userServices: UserServices,
    private toastr: ToastrService,
    public router: Router,
  ) {
    this.name = 'JAKIRO2';
    console.log("hola bashboard")
    this.role = this.checkRole();

  }
  prepareRoute(outlet: RouterOutlet) {

    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  closeSidenav() {
    $('.right-side-nav').toggleClass("open");
  }
  closeDrawer() {
    this.drawer.close();

  }

  showSuccess() {
    this.toastr.success('Hola Bienvenido', 'Jakiro2!');
    this.router.navigate(['/dashboard/Stats']);

  }
  dashboard() {
    this.router.navigate(['/dashboard/Stats']);
    this.drawer.close();
  }
  indicadores() {
    this.router.navigate(['/dashboard/indicadores']);
    this.drawer.close();
  }
  report() {
    this.router.navigate(['/dashboard/report']);
    this.drawer.close();
  }
  settings() {
    this.router.navigate(['/dashboard/settings']);
    this.drawer.close();
  }
  listarClientes() {
    this.router.navigate(['/dashboard/Client']);
    this.drawer.close();
  }
  listarBranch() {
    this.router.navigate(['/dashboard/Branch']);
    this.drawer.close();
  }
  listarColores() {
    this.router.navigate(['/dashboard/Color']);
    this.drawer.close();
  }
  listarServices() {
    this.router.navigate(['/dashboard/Service']);
    this.drawer.close();
  }
  listarSubServices() {
    this.router.navigate(['/dashboard/Sub-service']);
    this.drawer.close();
  }
  listarEntradas() {
    this.router.navigate(['/dashboard/Entradas']);
    this.drawer.close();
  }
  listarSalidas() {
    this.router.navigate(['/dashboard/Salidas']);
    this.drawer.close();
  }
  listarProcesadas() {
    this.router.navigate(['/dashboard/Procesadas']);
    this.drawer.close();
  }
  ngOnInit(): void {
    //this.showSuccess()
    $(document).ready(function () {
      $('.leftmenutrigger').on('click', function (e) {
        $('.right-side-nav').toggleClass("open");
        e.preventDefault();
      });
    });
    //this.localService.getJsonValue('info');
    let info = this.localService.getJsonValue('info');
    if (info) {
      if (info.user !== undefined) {
        this.userLoggedIN = (info.fullname === undefined) ? info : info.fullname;
      } else {
        this.userLoggedIN = info.fullname;
      }

    } else {
      this.router.navigateByUrl('');
    }

    let image = this.localService.getJsonValue('image');
    console.log("imagen:" + image)
    if (image !== undefined) {
      //image
      this.userProfileImage = image
    } else {
      this.userProfileImage = '../../../../assets/userProfile.png'


    }
  }

  goToMenu() {
    //this.router.navigateByUrl('/dashboard/menu');
    this.router.navigateByUrl('');
  }
  endSession() {
    this.userServices.logout().pipe()
      .subscribe((value: any) => {
        this.toastr.success("Sessión cerrada con exito");
        this.localService.clearToken();
        this.localService.removeKey('info');
        location.reload();
        // this.router.navigateByUrl('/login');
      });
  }




  goToProfile() {
    this.router.navigate(['/dashboard/profile']);
    this.drawer.close();

    //this.router.navigateByUrl('/dashboard/profile');
  }
  listarUsuarios() {
    this.router.navigate(['/dashboard/user']);
    this.drawer.close();
  }
  checkRole() {

    let info = this.localService.getJsonValue('info');
    if (info.rol) {
      if (info.rol.toLowerCase() === 'admin') {
        return 1;
      }
      if (info.rol.toLowerCase() === 'operador') {
        return 2;
      }
      if (info.rol.toLowerCase() === 'op_entradas') {
        return 3;
      }
    }

  }



}

