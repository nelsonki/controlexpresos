import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {EntradasServices} from "../../entradas-services/entradas-services";
import {colorMsg} from "../../../../utils/const/message";

@Component({
  selector: 'app-entradas-delete',
  templateUrl: './entradas-delete.component.html',
  styleUrls: ['./entradas-delete.component.scss']
})
export class EntradasDeleteComponent implements OnInit {
  public id:any;
  public modulo:any;

  constructor(
      public dialogRef: MatDialogRef<EntradasDeleteComponent>,
      public router: Router,
      public entradasServices: EntradasServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data[0];
      this.modulo = this.data[1];

  }
  ngOnInit() {
     

  }


  public deleteRow(id) {
      this.entradasServices.delete(this.id, this.modulo).subscribe(
        response => {
              this.toasTer.success(colorMsg.delete);
              this.reloadComponent();
          },
          error => {
            this.toasTer.error(colorMsg.errorProcess);
          }
        );
  }

  reloadComponent(){
      const currentUrl = this.router.url;
      const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
