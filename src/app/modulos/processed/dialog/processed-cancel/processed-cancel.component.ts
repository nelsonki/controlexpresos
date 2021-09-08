

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SalidasServices} from "../../../salidas/salidas-services/salidas-services";
import {SalidasMsg} from "../../../../utils/const/message";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import {LocalService} from '../../../../http/httpServices/local-service.service'
@Component({
  selector: 'app-processed-cancel',
  templateUrl: './processed-cancel.component.html',
  styleUrls: ['./processed-cancel.component.scss']
})
export class ProcessedCancelComponent implements OnInit {
  public id:any;
  public modulo:any;
  public bandera:any;
  public firstFormGroup: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<ProcessedCancelComponent>,
      public router: Router,
      public salidasServices: SalidasServices,
      public toasTer: ToastrService,
      private formBuilder: FormBuilder,
      public localService: LocalService,

      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data[0];
      this.modulo = this.data[1];
      this.bandera = this.data[2];

  }
  ngOnInit() {
    
    this.firstFormGroup = this.formBuilder.group({
      descripcion: ['','']
      

    });

  }


  public cancelarOperacion() {
    let info = this.localService.getJsonValue('info');
    let body = Object.assign({
      "cancel_reason": this.firstFormGroup.controls["descripcion"].value,
      "user": info.id
    });
    this.salidasServices.cancelarProcesadas(this.id, body).pipe()
    .subscribe((value: any) => {
      this.toasTer.success(value.message);
    });
    this.reloadComponent();
  }

  reloadComponent(){
      const currentUrl = this.router.url;
      const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
