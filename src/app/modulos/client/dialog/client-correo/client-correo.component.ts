import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ClientServices} from "../../client-services/client-services";
import {clientsMsg} from "../../../../utils/const/message";
import {ClientFormComponent}from '../../client-form/client-form.component'
@Component({
  selector: 'app-client-correo',
  templateUrl: './client-correo.component.html',
  styleUrls: ['./client-correo.component.scss']
})
export class ClientCorreoComponent implements OnInit {
  @ViewChild(ClientFormComponent) form: ClientFormComponent;

  public id:any;
  public verCorreos=[];
  constructor(
      public dialogRef: MatDialogRef<ClientCorreoComponent>,
      public router: Router,
      public clientServices: ClientServices,
      public toasTer: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: MatDialog
  ) {
      this.id = this.data;
  }
  ngOnInit() {
    var emails = (this.id)? this.id.split(","): "";
    this.verCorreos = (emails !== "") ? emails : [];
    console.log(this.verCorreos)
    }

 

}
