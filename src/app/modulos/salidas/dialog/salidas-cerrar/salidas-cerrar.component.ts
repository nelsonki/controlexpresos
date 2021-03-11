import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SalidasServices} from "../../salidas-services/salidas-services";
import {SalidasMsg} from "../../../../utils/const/message";

@Component({
  selector: 'app-salidas-cerrar',
  templateUrl: './salidas-cerrar.component.html',
  styleUrls: ['./salidas-cerrar.component.scss']
})
export class SalidasCerrarComponent implements OnInit {
  public id:any;
  public modulo:any;
  public bandera:any;

  constructor(
      public dialogRef: MatDialogRef<SalidasCerrarComponent>,
      public router: Router,
      public salidasServices: SalidasServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data[0];
      this.modulo = this.data[1];
      this.bandera = this.data[2];

  }
  ngOnInit() {
     

  }


  public cerrarOperacion() {/*
      this.salidasServices.delete(this.id, this.modulo).subscribe(
        response => {
              this.toasTer.success(SalidasMsg.delete);
              if(this.bandera!==1){
                this.reloadComponent();

              }
          },
          error => {
            this.toasTer.error(SalidasMsg.errorProcess);
          }
        );*/
  }

  reloadComponent(){
      const currentUrl = this.router.url;
      const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
