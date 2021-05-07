import * as animations from './../../../routerAnimations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';

import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';



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
export class DashboardComponent implements OnInit  {



  @ViewChild('drawer') 'drawer': MatDrawer;
  public name;
  public userProfileImage;
  public userLoggedSocial;
  public userLoggedIN;

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
    private toastr: ToastrService,
    public router: Router,
    ) {
       this.name = 'JAKIRO2';
       console.log("hola bashboard")
       
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
     listarProcesadas(){
      this.router.navigate(['/dashboard/Procesadas']);
      this.drawer.close();
     }
    ngOnInit(): void {
    //this.showSuccess()
   /* $(document).ready(function () {
      $('.leftmenutrigger').on('click', function (e) {
        $('.right-side-nav').toggleClass("open");
        e.preventDefault();
      });
    });*/
    //this.localService.getJsonValue('info');
    //let info = this.localService.getJsonValue('info');
    /*if (info) {
      if (info.user !== undefined) {
        this.userLoggedIN = (info.user.username === undefined) ? info.user : info.user.username;
      } else {
        this.userLoggedSocial = info.User.username;
      }

    } else {
      this.router.navigateByUrl('');
    }*/
    //this.localService.getJsonValue('image');
    let image = "";
    if (image !== undefined) {
      //image
      this.userProfileImage = '../../../../assets/userProfile.png'
    } else {
      this.userProfileImage = '../../../../assets/userProfile.png'

    }
  }

  goToMenu() {
    //this.router.navigateByUrl('/dashboard/menu');
    this.router.navigateByUrl('');
  }
  endSession() {
    //this.localService.clearToken();
    //this.localService.removeKey('info');
    this.router.navigateByUrl('/login');
  }
 
  
  goToProfile() {
    this.router.navigate(['/dashboard/profile']);
    this.drawer.close();

    //this.router.navigateByUrl('/dashboard/profile');
  }
  listarUsuarios(){
    this.router.navigate(['/dashboard/user']);
    this.drawer.close();
  }
  checkRole() {
/*
    let info = this.localService.getJsonValue('info');
    if (info.roles) {
      if (info.roles.toLowerCase() === 'usuario') {
        return true;
      } else {
        return false;
      }
    } else {
      if (info.User.roles[0].name.toLowerCase() === 'usuario') {
        return true;
      } else {
        return false;
      }
    }
*/
  }
  
 

}

