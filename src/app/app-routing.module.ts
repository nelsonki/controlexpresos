import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './../app/modulos/dashboard/dashboard/dashboard.component';
//import { ProfileComponent } from './modulos/profile/profile/profile.component';
import { CanActivateViaAuthGuard } from './guard';
const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modulos/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    loadChildren: () => import('./modulos/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children:
      [
        //canActivate: [CanActivateViaAuthGuard], 
        //{ path: 'profile', component: ProfileComponent },
        {
          path: 'user', canActivate: [CanActivateViaAuthGuard], canDeactivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/user/user.module').then(m => m.UserModule)
        },
        {
          path: 'profile', canActivate: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/profile/profile.module').then(m => m.ProfileModule)
        },
        {
          path: 'drivers', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/drivers/drivers.module').then(m => m.DriversModule)
        },
        {
          path: 'Branch', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/branch/branch.module').then(m => m.BranchModule)
        },
        {
          path: 'Color', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/color/color.module').then(m => m.ColorModule)
        },
        {
          path: 'Service', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/service/service.module').then(m => m.ServiceModule)
        },
        {
          path: 'Sub-service', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/sub-service/sub-service.module').then(m => m.SubServiceModule)
        },

        {
          path: 'Stats', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/stats/stats.module').then(m => m.StatsModule)
        },
        {
          path: 'indicadores', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/indicadores/indicadores.module').then(m => m.IndicadoresModule)
        },
        {
          path: 'settings', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/settings/settings.module').then(m => m.SettingsModule)
        },

        {
          path: 'vehicles', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/vehicles/vehicles.module').then(m => m.VehiclesModule)
        },
        {
          path: 'partners', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/partners/partners.module').then(m => m.PartnersModule)
        },
        {
          path: 'coins', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/coins/coins.module').then(m => m.CoinsModule)
        },
        {
          path: 'additionals', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/additionals/additionals.module').then(m => m.AdditionalsModule)
        },
        {
          path: 'offices', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/offices/offices.module').then(m => m.OfficesModule)
        },
        {
          path: 'liquidations', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/liquidations/liquidations.module').then(m => m.LiquidationsModule)
        },
        {
          path: 'gastosvarios', canActivate: [CanActivateViaAuthGuard], canActivateChild: [CanActivateViaAuthGuard],
          loadChildren: () => import('./modulos/gastosvarios/gastosvarios.module').then(m => m.GastosvariosModule)
        },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
