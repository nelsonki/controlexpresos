import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LocalService } from './http/httpServices/local-service.service';
import * as animations from './routerAnimations'

@Component({
  selector: 'app-root',
  template: `
  <ngx-loading-bar [color]="'red'" [height]="'4px'"></ngx-loading-bar>
  <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  animations: [ // aqui iran nuestras animaciones
    // fader,
    // slider,
    // transformer,
    animations.fader
  ]
})
export class AppComponent {

  constructor(public localService: LocalService, public router: Router) {
    var info = this.localService.getJsonValue('info');
    if (!info || info.session.original.token == '') {
      this.router.navigateByUrl('login');
    }
  }

  title = 'Trackingfrontend2';
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
