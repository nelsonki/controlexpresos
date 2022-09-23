
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { GastosvariosServices } from "../../gastosvarios-services/gastosvarios-services";
import { userMsg } from "../../../../utils/const/message";

@Component({
  selector: 'app-gastosvarios-delete',
  templateUrl: './gastosvarios-delete.component.html',
  styleUrls: ['./gastosvarios-delete.component.scss']
})
export class GastosvariosDeleteComponent implements OnInit {
  public id: any;

  constructor(
    public dialogRef: MatDialogRef<GastosvariosDeleteComponent>,
    public router: Router,
    public gastosvariosServices: GastosvariosServices,
    public toasTer: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
    this.id = this.data;


  }
  ngOnInit() {


  }


  public deleteRow() {
    this.gastosvariosServices.delete(this.id).subscribe(
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

