
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CoinsServices } from "../../coins-services/coins-services";
import { userMsg } from "../../../../utils/const/message";

@Component({
  selector: 'app-coins-delete',
  templateUrl: './coins-delete.component.html',
  styleUrls: ['./coins-delete.component.scss']
})
export class CoinsDeleteComponent implements OnInit {
  public id: any;

  constructor(
    public dialogRef: MatDialogRef<CoinsDeleteComponent>,
    public router: Router,
    public coinsServices: CoinsServices,
    public toasTer: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
    this.id = this.data;


  }
  ngOnInit() {


  }


  public deleteRow() {
    this.coinsServices.delete(this.id).subscribe(
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

