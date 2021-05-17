import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {BranchServices} from "../../branch-services/branch-services";
import {branchMsg} from "../../../../utils/const/message";

@Component({
  selector: 'app-branch-delete',
  templateUrl: './branch-delete.component.html',
  styleUrls: ['./branch-delete.component.scss']
})
export class BranchDeleteComponent implements OnInit {
  public id:any;

  constructor(
      public dialogRef: MatDialogRef<BranchDeleteComponent>,
      public router: Router,
      public branchServices: BranchServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data;
  }
  ngOnInit() {
  }


  public deleteRow(id) {
      this.branchServices.delete(this.id).subscribe(
        response => {
              this.toasTer.success(branchMsg.delete);
              this.reloadComponent();
          },
          error => {
            this.toasTer.error(branchMsg.errorProcess);
          }
        );
  }

  reloadComponent(){
      const currentUrl = this.router.url;
      const refreshUrl = currentUrl.indexOf('dashboard') > -1 ? '/' : '/';
      this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }


}
