import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
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
  title = 'Trackingfrontend2';
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
