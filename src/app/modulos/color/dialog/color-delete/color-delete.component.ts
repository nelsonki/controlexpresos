import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ColorServices} from "../../color-services/color-services";
import {colorMsg} from "../../../../utils/const/message";

@Component({
  selector: 'app-color-delete',
  templateUrl: './color-delete.component.html',
  styleUrls: ['./color-delete.component.scss']
})
export class ColorDeleteComponent implements OnInit {
  public id:any;

  constructor(
      public dialogRef: MatDialogRef<ColorDeleteComponent>,
      public router: Router,
      public colorServices: ColorServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data;
  }
  ngOnInit() {
  }


  public deleteRow(id) {
      this.colorServices.delete(this.id).subscribe(
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
