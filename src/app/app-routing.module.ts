import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './../app/modulos/dashboard/dashboard/dashboard.component';

const routes: Routes = [
  {
      path: '',
      component: DashboardComponent,
       children:
      [
       {
          path: 'Client',
          loadChildren: () => import('./modulos/client/client.module').then(m => m.ClientModule)
        },
        {
          path: 'Entradas',
          loadChildren: () => import('./modulos/entradas/entradas.module').then(m => m.EntradasModule)
        },
        {
          path: 'Salidas',
          loadChildren: () => import('./modulos/salidas/salidas.module').then(m => m.SalidasModule)
        },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
