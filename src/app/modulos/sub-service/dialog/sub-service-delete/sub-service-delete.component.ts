import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SubServiceServices} from "../../sub-service-services/sub-service-services";
import {subserviceMsg} from "../../../../utils/const/message";

@Component({
  selector: 'app-sub-service-delete',
  templateUrl: './sub-service-delete.component.html',
  styleUrls: ['./sub-service-delete.component.scss']
})
export class SubServiceDeleteComponent implements OnInit {
  public id:any;

  constructor(
      public dialogRef: MatDialogRef<SubServiceDeleteComponent>,
      public router: Router,
      public subServiceServices: SubServiceServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data;
  }
  ngOnInit() {
  }


  public deleteRow(id) {
      this.subServiceServices.delete(this.id).subscribe(
        response => {
              this.toasTer.success(subserviceMsg.delete);
              this.reloadComponent();
          },
          error => {
            this.toasTer.error(subserviceMsg.errorProcess);
          }
        );
  }

  reloadComponent(){
      const currentUrl = this.router.url;
      const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
