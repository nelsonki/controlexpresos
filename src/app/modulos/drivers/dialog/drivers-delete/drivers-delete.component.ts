
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DriversServices } from "../../drivers-services/drivers-services";
import { userMsg } from "../../../../utils/const/message";

@Component({
  selector: 'app-drivers-delete',
  templateUrl: './drivers-delete.component.html',
  styleUrls: ['./drivers-delete.component.scss']
})
export class DriversDeleteComponent implements OnInit {
  public id: any;

  constructor(
    public dialogRef: MatDialogRef<DriversDeleteComponent>,
    public router: Router,
    public driversServices: DriversServices,
    public toasTer: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
    this.id = this.data;


  }
  ngOnInit() {


  }


  public deleteRow() {
    this.driversServices.delete(this.id).subscribe(
      response => {
        this.toasTer.success(userMsg.delete);
        this.reloadComponent()
      },
      error => {
        this.toasTer.error(userMsg.errorProcess);
      }
    );
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}

