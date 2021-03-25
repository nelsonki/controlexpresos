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
          path: 'Branch',
          loadChildren: () => import('./modulos/branch/branch.module').then(m => m.BranchModule)
        },
        {
          path: 'Color',
          loadChildren: () => import('./modulos/color/color.module').then(m => m.ColorModule)
        },
        {
          path: 'Service',
          loadChildren: () => import('./modulos/service/service.module').then(m => m.ServiceModule)
        },
        {
          path: 'Sub-service',
          loadChildren: () => import('./modulos/sub-service/sub-service.module').then(m => m.SubServiceModule)
        },
        {
          path: 'Entradas',
          loadChildren: () => import('./modulos/entradas/entradas.module').then(m => m.EntradasModule)
        },
        {
          path: 'Salidas',
          loadChildren: () => import('./modulos/salidas/salidas.module').then(m => m.SalidasModule)
        },
        {
          path: 'Procesadas',
          loadChildren: () => import('./modulos/processed/processed.module').then(m => m.ProcessedModule)
        },
        {
          path: 'Stats',
          loadChildren: () => import('./modulos/stats/stats.module').then(m => m.StatsModule)
        },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
