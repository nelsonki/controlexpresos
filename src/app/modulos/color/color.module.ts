import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorTableComponent } from './color-table/color-table.component';
import { ColorFormComponent } from './color-form/color-form.component';



@NgModule({
  declarations: [ColorTableComponent, ColorFormComponent],
  imports: [
    CommonModule
  ]
})
export class ColorModule { }
