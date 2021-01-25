import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <ngx-loading-bar [color]="'red'" [height]="'4px'"></ngx-loading-bar>
  <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Trackingfrontend2';
}
