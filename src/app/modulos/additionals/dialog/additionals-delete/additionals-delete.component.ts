
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AdditionalsServices } from "../../addtionals-services/additionals-services";
import { userMsg } from "../../../../utils/const/message";

@Component({
  selector: 'app-additionals-delete',
  templateUrl: './additionals-delete.component.html',
  styleUrls: ['./additionals-delete.component.scss']
})
export class AdditionalsDeleteComponent implements OnInit {
  public id: any;

  constructor(
    public dialogRef: MatDialogRef<AdditionalsDeleteComponent>,
    public router: Router,
    public additionalsServices: AdditionalsServices,
    public toasTer: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
    this.id = this.data;


  }
  ngOnInit() {


  }


  public deleteRow() {
    this.additionalsServices.delete(this.id).subscribe(
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

