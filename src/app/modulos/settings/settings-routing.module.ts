import { RouterModule, Routes } from '@angular/router';

import { SettingsFormComponent } from './settings-form/settings-form.component'
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '', component: SettingsFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
