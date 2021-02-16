import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ServiceServices} from "../../service-services/service-services";
import {serviceMsg} from "../../../../utils/const/message";

@Component({
  selector: 'app-service-delete',
  templateUrl: './service-delete.component.html',
  styleUrls: ['./service-delete.component.scss']
})
export class ServiceDeleteComponent implements OnInit {
  public id:any;

  constructor(
      public dialogRef: MatDialogRef<ServiceDeleteComponent>,
      public router: Router,
      public serviceServices: ServiceServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data;
  }
  ngOnInit() {
  }


  public deleteRow(id) {
      this.serviceServices.delete(this.id).subscribe(
        response => {
              this.toasTer.success(serviceMsg.delete);
              this.reloadComponent();
          },
          error => {
            this.toasTer.error(serviceMsg.errorProcess);
          }
        );
  }

  reloadComponent(){
      const currentUrl = this.router.url;
      const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
