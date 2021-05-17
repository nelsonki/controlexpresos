import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ClientServices} from "../../client-services/client-services";
import {clientsMsg} from "../../../../utils/const/message";

@Component({
  selector: 'app-client-delete',
  templateUrl: './client-delete.component.html',
  styleUrls: ['./client-delete.component.scss']
})
export class ClientDeleteComponent implements OnInit {
  public id:any;

  constructor(
      public dialogRef: MatDialogRef<ClientDeleteComponent>,
      public router: Router,
      public clientServices: ClientServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data;
  }
  ngOnInit() {
  }


  public deleteRow(id) {
      this.clientServices.delete(this.id).subscribe(
        response => {
              this.toasTer.success(clientsMsg.delete);
              this.reloadComponent();
          },
          error => {
            this.toasTer.error(clientsMsg.errorProcess);
          }
        );
  }

  reloadComponent(){
      const currentUrl = this.router.url;
      const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
