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
    goToMenu() {
      //this.router.navigateByUrl('/dashboard/menu');
      this.router.navigateByUrl('');
    }
    showSuccess() {
      this.toastr.success('Hola Bienvenido', 'Jakiro2!');
    }
    dashboard() {
      this.router.navigate(['/']);
      this.drawer.close();
    }
    listarClientes() {
     this.router.navigate(['/Client']);
     this.drawer.close();
    }
    listarBranch() {
      this.router.navigate(['/Branch']);
      this.drawer.close();
     }
    listarEntradas() {
      this.router.navigate(['/Entradas']);
      this.drawer.close();
     }
     listarSalidas() {
      this.router.navigate(['/Salidas']);
      this.drawer.close();
     }
    ngOnInit(): void {
    this.showSuccess()
  }
  
 

}

