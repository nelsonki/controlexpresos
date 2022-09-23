
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { OfficesServices } from "../../offices-services/offices-services";
import { userMsg } from "../../../../utils/const/message";

@Component({
  selector: 'app-offices-delete',
  templateUrl: './offices-delete.component.html',
  styleUrls: ['./offices-delete.component.scss']
})
export class OfficesDeleteComponent implements OnInit {
  public id: any;

  constructor(
    public dialogRef: MatDialogRef<OfficesDeleteComponent>,
    public router: Router,
    public officesServices: OfficesServices,
    public toasTer: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
    this.id = this.data;


  }
  ngOnInit() {


  }


  public deleteRow() {
    this.officesServices.delete(this.id).subscribe(
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

