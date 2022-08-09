
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { VehiclesServices } from "../../vehicles-services/vehicles-services";
import { colorMsg } from "../../../../utils/const/message";

@Component({
  selector: 'app-vehicles-delete',
  templateUrl: './vehicles-delete.component.html',
  styleUrls: ['./vehicles-delete.component.scss']
})
export class VehiclesDeleteComponent implements OnInit {
  public id: any;

  constructor(
    public dialogRef: MatDialogRef<VehiclesDeleteComponent>,
    public router: Router,
    public vehiclesServices: VehiclesServices,
    public toasTer: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
    this.id = this.data;
  }
  ngOnInit() {
  }


  public deleteRow(id) {
    this.vehiclesServices.delete(this.id).subscribe(
      response => {
        this.toasTer.success(colorMsg.delete);
        this.reloadComponent();
      },
      error => {
        this.toasTer.error(colorMsg.errorProcess);
      }
    );
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
