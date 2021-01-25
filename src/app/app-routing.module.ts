import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './../app/modulos/dashboard/dashboard/dashboard.component';

const routes: Routes = [
  {
      path: '',
      component: DashboardComponent,
      /* children:
      [
       {
          path: 'Boardings',
          loadChildren: () => import('./modules/boardings/boardings.module').then(m => m.BoardingsModule)
        },
      ]*/
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
