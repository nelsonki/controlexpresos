
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserServices} from "../../user-services/user-services";
import {userMsg} from "../../../../utils/const/message";

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {
  public id:any;

  constructor(
      public dialogRef: MatDialogRef<UserDeleteComponent>,
      public router: Router,
      public userServices: UserServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data;
      

  }
  ngOnInit() {
     

  }


  public deleteRow() {
      this.userServices.delete(this.id).subscribe(
        response => {
              this.toasTer.success(userMsg.delete);
              this.reloadComponent()
          },
          error => {
            this.toasTer.error(userMsg.errorProcess);
          }
        );
  }

  reloadComponent(){
      const currentUrl = this.router.url;
      const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
