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
    this.name = 'Control Expresos';
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
    this.toastr.success('Hola Bienvenido', 'Control Expresos!');
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
    this.router.navigate(['/dashboard/report-form/report-form']);
    this.drawer.close();
  }
  settings() {
    this.router.navigate(['/dashboard/settings']);
    this.drawer.close();
  }
  listarDrivers() {
    this.router.navigate(['/dashboard/drivers']);
    this.drawer.close();
  }
  listarPartners() {
    this.router.navigate(['/dashboard/partners']);
    this.drawer.close();
  }
  listarVehicles() {
    this.router.navigate(['/dashboard/vehicles']);
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
  listarCoins() {
    this.router.navigate(['/dashboard/coins']);
    this.drawer.close();
  }
  listarGastos() {
    this.router.navigate(['/dashboard/additionals']);
    this.drawer.close();
  }
  listarGastosViaje() {
    this.router.navigate(['/dashboard/gastosvarios']);
    this.drawer.close();
  }
  listarOficinas() {
    this.router.navigate(['/dashboard/offices']);
    this.drawer.close();
  }
  listarLiquidaciones() {
    this.router.navigate(['/dashboard/liquidations']);
    this.drawer.close();
  }
  listarProcesadas() {

    let info = this.localService.getJsonValue('info');
    let client_id = info.id_cliente_asoc
    this.router.navigate(['/dashboard/Procesadas/Procesadas/' + client_id])

    // this.router.navigate(['/dashboard/Procesadas/Procesadas']);
    this.drawer.close();
  }
  ngOnInit(): void {
    this.role = this.checkRole();
    console.log(this.role)
    //this.showSuccess()
    $(document).ready(function () {
      $('.leftmenutrigger').on('click', function (e) {
        $('.right-side-nav').toggleClass("open");
        e.preventDefault();
      });
    });
    //this.localService.getJsonValue('info');
    let info = this.localService.getJsonValue('info');
    console.log(info)
    if (info) {
      if (info.user !== undefined) {
        this.userLoggedIN = (info.data.name === undefined) ? info : info.data.name;
      } else {
        this.userLoggedIN = info.data.name;
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
        this.toastr.success("Sessi??n cerrada con exito");
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
    console.log(info)
    if (info.data.role) {
      if (info.data.role === 1) {
        return 1;
      }
      if (info.data.role === 2) {
        return 2;
      }

    }

  }



}

